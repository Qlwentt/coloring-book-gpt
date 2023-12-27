require_relative '../services/ai_client'

class WebhookController < ApplicationController
  skip_before_action :verify_authenticity_token

  def receive
    if params[:event] == 'images.items.create' or not ['in-progress', 'completed', 'failed'].include?(params[:payload][:status])
      return head :ok
    end
    
    4.times do |i|
      image = Image.find_by!(mid_id: "#{params[:payload][:id]}-#{i+1}")
      mid_url = nil
      if params[:payload][:status] == 'in-progress' and params[:payload][:progress] > 0
        mid_url = params[:payload][:url]
        image.update(remote_url: mid_url)
      elsif params[:payload][:status] == 'completed'
        mid_url = params[:payload][:upscaled_urls][i]
        image.book.with_lock do
          image.book.update!(image_loaded_count: image.book.image_loaded_count + 1)
        end
        remote_image = URI.open(mid_url)
        image.image_url.attach(io: remote_image, filename: "#{image.book.imagine_query}_#{image.mid_id}.png", content_type: 'image/png')
        image.remote_url = image.image_url.url
        image.save!
      end
    end

    if params[:payload][:status] == 'failed'
      lead_image = Image.find_by!(mid_id: "#{params[:payload][:id]}-1")
      if lead_image.retries < 1
        ai_client = AiClient.new
        response = ai_client.request_book_image(params[:payload][:prompt])
        
        4.times do |i|
          image = Image.find_by!(mid_id: "#{params[:payload][:id]}-#{i+1}")
          image.with_lock do
            image.update!(mid_id: "#{response.dig("data", "id")}-#{i+1}", retries: image.retries + 1)
          end
        end
        
      else
        4.times do |i|
          image = Image.find_by!(mid_id: "#{params[:payload][:id]}-#{i+1}")
          image.destroy!
        end
      end
    end
    
    head :ok
  end  
end