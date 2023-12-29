class Book < ApplicationRecord
  has_many :user_books
  has_many :users, through: :user_books
  has_many :images, -> { order(created_at: :desc) }
  has_one_attached :pdf
end
