class LoginController < ApplicationController
  def index
    redirect_post('/auth/google_oauth2', options: {authenticity_token: :auto})
  end
end