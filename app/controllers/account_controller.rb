# app/controllers/registrations_controller.rb
class AccountController < ApplicationController

  # GET

  def signup_form
    flash[:failed] = params[:failed]
  end

  def reset_password_form
    flash[:failed] = params[:failed]
  end

  def verify_email_form
    flash[:failed] = params[:failed]
  end

  # POST

  def signup
    body = {
      email: params[:email],
      password: params[:password],
      display_name: params[:display_name]
    }

    response = APIService.post("/auth/signup", body)

    if response.code.to_i == 201
      #thong bao thanh cong ?
      redirect_to login_path
    elsif response.code.to_i == 409
      #conflict
      redirect_to signup_path(failed: "conflict")
    else
      redirect_to signup_path(failed: "else")
    end
  end

  def reset_password
    body = {
      email: params[:email],
      new_password: params[:new_password],
      otp: params[:otp]
    }

    response = APIService.post("/auth/reset-password", body)

    if response.code.to_i == 200
      #thong bao thanh cong ?
      redirect_to login_path
    elsif response.code.to_i == 406
      redirect_to reset_password_path(failed: "otp")
    elsif response.code.to_i == 401
      redirect_to reset_password_path(failed: "email")
    else
      redirect_to reset_password_path(failed: "else")
    end
  end

  def verify_email
    body = {
      otp: params[:otp]
    }

    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.post("/auth/verify/confirm", body, header)

    if response.code.to_i == 202
      #thong bao thanh cong ?
      redirect_to login_path
    elsif response.code.to_i == 406
      redirect_to verify_email_path(failed: "otp")
    else
      redirect_to verify_email_path(failed: "else")
    end
  end
end
