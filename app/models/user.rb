class User < ApplicationRecord
  has_many :user_books
  has_many :books, through: :user_books

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_initialize do |user|
      user.name = auth.info.name
      user.email = auth.info.email
    end
  end

  def is_admin?
    return self.email == 'quai.wentt@gmail.com'
  end
end
