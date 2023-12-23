require_relative '../../../services/open_ai_client'
class Api::V1::BooksController < Api::V1::BaseController
  def create
    open_ai_client = OpenAiClient.new 
    # response = open_ai_client.get_book_images_from_query(params[:query])
    response = {
      "images": [
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-GJygMSaQ0oubD2uWwqYdUbWp/user-UhEeekcvwvurDSS01y9ZLvfd/img-AAENtwpS6qr8u4BVJx9oAFZh.png?st=2023-12-23T00%3A03%3A36Z&se=2023-12-23T02%3A03%3A36Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-22T23%3A09%3A26Z&ske=2023-12-23T23%3A09%3A26Z&sks=b&skv=2021-08-06&sig=mqo/u%2BXd4jwQD8PHuieW2hBxb9TrrRYYjktmOC2DPso%3D", 
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-GJygMSaQ0oubD2uWwqYdUbWp/user-UhEeekcvwvurDSS01y9ZLvfd/img-ecUQ3yTogy0n9dRQJNAlnkJr.png?st=2023-12-23T00%3A03%3A45Z&se=2023-12-23T02%3A03%3A45Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-22T23%3A09%3A41Z&ske=2023-12-23T23%3A09%3A41Z&sks=b&skv=2021-08-06&sig=cvPr6WsQRraszTNoVRgYo53ZYpwdPl2s0eelaGU9u8g%3D"
      ], 
      "prompts": [
        "1. \"Create a coloring book page featuring different breeds of dogs playing in a park.\"", 
        "2. \"Design a coloring book page with a scene of a dog's birthday party, including various dog breeds, balloons, and a birthday cake.\""
      ]
    }
    book = Book.create(imagine_query: params[:query])
    response[:images].zip(response[:prompts]).each do |image, prompt|
      image = Image.create(remote_url: image, prompt: prompt, book_id: book.id)
    end
    current_user.books << book

    puts response
    return render json: { data: book(:include => :images) }
  end

  def index
    return render json: { data: current_user.books }
  end

  def show
    book = Book.find(params[:id])
    return render json: { data: book.as_json(include: :images) }
  end
end