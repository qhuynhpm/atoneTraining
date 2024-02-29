require 'net/http'
require 'json'

class SessionController < ApplicationController

  def login_form
    header = { Authorization: cookies[:nppoker_auth_token] }
    response = APIService.get("/auth/token/check", nil, header)

    if response.code.to_i == 200
      redirect_to home_path
    else
      flash[:failed] = params[:failed]
    end
  end

  def login
    body = {
      email: params[:email],
      password: params[:password]
    }

    response = APIService.post("/auth/login", body)

    if response.code.to_i == 200
      token = response['Authorization']
      cookies[:nppoker_auth_token] = { value: token}

      redirect_to home_path
    elsif response.code.to_i == 403
      token = response['Authorization']
      cookies[:nppoker_auth_token] = { value: token}
      #redirect to email verify page
      redirect_to verify_email_path
    else
      redirect_to login_path(failed: true)
    end
  end

  def logout
    cookies.delete(:nppoker_auth_token)
    reset_session
    redirect_to login_path
  end
end
