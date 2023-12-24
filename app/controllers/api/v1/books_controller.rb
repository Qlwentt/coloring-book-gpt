require_relative '../../../services/open_ai_client'
require 'open-uri'

class Api::V1::BooksController < Api::V1::BaseController
  def create
    open_ai_client = OpenAiClient.new 
    response = open_ai_client.get_book_images_from_query(params[:query])
    book = Book.create(imagine_query: params[:query])
    query = params[:query]
    response[:images].zip(response[:prompts]).each do |open_ai_image_url, prompt|
      puts "image_url: #{open_ai_image_url}"
      image = Image.create(prompt: prompt, book_id: book.id)
      remote_image = URI.open(open_ai_image_url)
      image.image_url.attach(io: remote_image, filename: "#{query}_#{SecureRandom.random_number(1000000)}.png", content_type: 'image/png')
      image.remote_url = image.image_url.url
      image.save!
      book.images << image
    end
    current_user.books << book

    puts response
    return render json: { data: book.as_json(:include => :images) }
  end

  def index
    return render json: { data: current_user.books }
  end

  def show
    book = Book.find(params[:id])
    book.images.each do |image|
      service_url = image.image_url.blob.url(expires_in: 1.week.to_i, disposition: 'inline')
      image.update(remote_url: service_url)
    end 
    return render json: { data: book.as_json(include: :images) }
  end
end