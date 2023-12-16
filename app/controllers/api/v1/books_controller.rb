class Api::V1::BooksController < ActionController::API
  def create
    return render json: { data: s3_url: 'blah' }
  end
end