require_relative '../../../services/open_ai_client'
class Api::V1::BooksController < ActionController::API
  def create
    open_ai_client = OpenAiClient.new 
    response = open_ai_client.get_book_images_from_query(params[:query])
    puts response
    return render json: { data: { images: response[:images], prompts: response[:prompts] } }
  end
end