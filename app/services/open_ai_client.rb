require "openai"

OpenAI.configure do |config|
  config.access_token = ENV.fetch("OPENAI_API_KEY")
end
class OpenAiClient
  def initialize
    @client = OpenAI::Client.new
  end

  def get_book_images_from_query(query)
    prompts = self.get_book_prompts(query)
    return self.get_book_images_from_prompts(prompts)
  end
  
  protected
  def get_book_prompts(query)
    response = @client.chat(
    parameters: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Write 2 prompts that I will give to DALLE to make coloring book pages. The coloring books pages all have to do with this theme: #{query}."}], # Required.
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
end