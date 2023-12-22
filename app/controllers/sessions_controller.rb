class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create

  def create
    access_token = request.env["omniauth.auth"]
    user = User.from_omniauth(access_token)
    cookies.encrypted[:current_user_id] = { value: user.id }
    
    redirect_to root_path
  end

  def destroy
    cookies.encrypted[:current_user_id] = nil

    redirect_to root_path
  end
end