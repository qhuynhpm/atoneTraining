# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :auth_ping, except: [:login, :login_form, :reset_password, :reset_password_form, :signup, :signup_form]

  private

  def auth_ping
    header = { Authorization: cookies[:nppoker_auth_token] }
    response = APIService.get("/auth/token/check", nil, header)

    if response.code.to_i != 200
      redirect_to login_path
    end
  end
end
