require_relative '../../../services/open_ai_client'
class Api::V1::BooksController < ActionController::API
  def create
    open_ai_client = OpenAiClient.new 
    response = open_ai_client.get_book_images_from_query(params[:query])
    # response = {
    #   "images": [
    #     "https://oaidalleapiprodscus.blob.core.windows.net/private/org-GJygMSaQ0oubD2uWwqYdUbWp/user-UhEeekcvwvurDSS01y9ZLvfd/img-Ryoo2EdSbiWbK4pqKWDWkmYJ.png?st=2023-12-21T00%3A43%3A41Z&se=2023-12-21T02%3A43%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-20T23%3A10%3A58Z&ske=2023-12-21T23%3A10%3A58Z&sks=b&skv=2021-08-06&sig=4tfQpa2JvqgOFcxVny3akogkEWUwF4EIRQfVlmIqiv8%3D",
    #     "https://oaidalleapiprodscus.blob.core.windows.net/private/org-GJygMSaQ0oubD2uWwqYdUbWp/user-UhEeekcvwvurDSS01y9ZLvfd/img-NYfPS2uh1p49HzoyA4YJCIUA.png?st=2023-12-21T00%3A43%3A50Z&se=2023-12-21T02%3A43%3A50Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-20T23%3A15%3A09Z&ske=2023-12-21T23%3A15%3A09Z&sks=b&skv=2021-08-06&sig=WXlHzeDrj6GzshwGOChz80St1E1CzzW63WyOjuZPITM%3D"
    #   ],
    #   "prompts": [
    #     "1) \"Create a coloring book page featuring a festive Christmas scene with a decorated tree, presents, stockings, snowflakes, and Santa Claus.\"",
    #     "2) \"Design a coloring book page depicting a Christmas-themed scene that includes reindeers, a sleigh full of gifts, a snowy village, and children making a snowman.\""
    #   ]
    # }
    puts response
    return render json: { data: { images: response[:images], prompts: response[:prompts] } }
  end
end