class ApplicationController < ActionController::Base
  protect_from_forgery unless: -> { request.format.json? }

  helper_method :logged_in?, :current_user
  
  def logged_in?
    cookies.encrypted[:current_user_id].present?
  end

  def current_user
    User.find(cookies.encrypted[:current_user_id]) rescue nil if cookies.encrypted[:current_user_id].present?
  end
end
