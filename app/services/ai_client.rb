require "openai"
require 'net/http'
require 'uri'

OpenAI.configure do |config|
  config.access_token = ENV.fetch("OPENAI_API_KEY")
end
class AiClient
  def initialize
    @client = OpenAI::Client.new
  end

  def get_book_images_from_query(query)
    prompts = self.get_book_prompts(query)
    return self.get_book_images_from_prompts(prompts)
  end

  def request_book_images_from_query(query)
    prompts = self.get_book_prompts(query)
    image_info = self.request_book_images_from_prompts(prompts)
    return image_info
  end

  def request_book_image(prompt)
    uri = URI('https://cl.imagineapi.dev/items/images')
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    request['Authorization'] = "Bearer #{ENV['MIDJOURNEY_API_KEY']}"
    request.body = { prompt: "#{prompt}A coloring book page for children. Flat, 2D. Black lines with white fill only. Line art. No color. No shading. No solids.  No 3D. --ar 3:4" }.to_json
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end
    return JSON.parse(response.body)
  end
  
  protected
  def get_book_prompts(query)
    response = @client.chat(
    parameters: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Write 2 prompts that I will give to DALLE to make coloring book pages. The coloring book pages all have to do with this theme: #{query}."}], # Required.
        temperature: 0.7,
    })
    return response.dig("choices", 0, "message", "content").split("\n").compact_blank
  end

  def get_book_images_from_prompts(prompts)
    images = []
    prompts.each do |prompt|
      images.push(self.get_book_image(prompt))
    end
    return { images: images, prompts: prompts }
  end

  def get_book_image(prompt)
    response = @client.images.generate(parameters: { model: "dall-e-3", prompt: "A coloring book image. #{prompt}. I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS", })
    return response.dig("data", 0, "url")
  end

  def request_book_images_from_prompts(prompts)
    image_info = []
    prompts.each do |prompt|
      response = self.request_book_image(prompt)
      image_info.push({ prompt: prompt, mid_id: response.dig("data", "id") })
    end
    return image_info
  end
end