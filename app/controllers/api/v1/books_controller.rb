require_relative '../../../services/ai_client'
require 'open-uri'
require 'rmagick'
require 'tempfile'

class Api::V1::BooksController < Api::V1::BaseController

  def create
    query = params[:query]
    ai_client = AiClient.new
    responses = ai_client.request_book_images_from_query(query)
    book = Book.create(imagine_query: query)
    responses.each do |response|
      4.times do |i|
        image = Image.create(prompt: response[:prompt], book_id: book.id, mid_id: "#{response[:mid_id]}-#{i+1}") # remote_url: 'https://storage.cloud.google.com/coloring-book-gpt-dev/progress_bar.png'
        book.images << image
      end
    end
    current_user.books << book
    return render json: { data: book.as_json}
  end

  def index
    books = []
    for book in current_user.books
      if book.pdf.attached?
        service_url = book.pdf.blob.url(expires_in: 1.week.to_i, disposition: 'inline')
        book.update(pdf_url: service_url)
      end
      purchased = UserBook.exists?(user_id: current_user.id, book_id: book.id, is_bought: true)
      book_json = book.as_json.merge({ purchased: purchased })
      books << book_json
    end
    return render json: { data: books }
  end

  def show
    if not UserBook.where(user_id: current_user.id, id: params[:id]).exists?
      return render json: { error: "You do not have permission view this book" }, status: 403
    end
    book = Book.find(params[:id])
    book.images.each do |image|
      if image.image_url.attached?
        service_url = image.image_url.blob.url(expires_in: 1.week.to_i, disposition: 'inline')
        image.update(remote_url: service_url)
      end
    end 
    return render json: { data: book.as_json(include: :images) }
  end

  def redeem_license
    if not UserBook.where(user_id: current_user.id, id: params[:id]).exists?
      return render json: { error: "You do not have permission to redeem this license." }, status: 403
    end

    gumroad_client = GumroadClient.new
    is_valid = gumroad_client.is_license_valid(params[:license_key])

    if not is_valid
      return render json: { error: "Invalid license key. Either wrong key or it has already been used" }, status: 403
    end

    user_book = UserBook.find_by(user_id: current_user.id, book_id: params[:id])
    self.make_pdf
    user_book.update(is_bought: true)

    return render json: { success: true }

  end

  protected

  def make_pdf
    book = Book.find(params[:id])
    images = []

    book.images.each do |image|
      images << Magick::Image.from_blob(URI.open(image.remote_url).read).first
    end

    image_list = Magick::ImageList.new
    image_list += images

    Tempfile.create([book.imagine_query.parameterize, '.pdf']) do |file|
      image_list.write(file.path)
      book.pdf.attach(io: File.open(file.path), filename: file.path, content_type: 'application/pdf')
      book.update(pdf_url: book.pdf.url)
    end
  end
end