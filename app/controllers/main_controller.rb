class MainController < ApplicationController
  def home

  end

  def my_profile

    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.get("/user/my-profile", nil, header)

    if response.code.to_i == 200
      data = JSON.parse(response.body)

      redirect_to my_profile_path(failed: true) unless data.present?

      @current_user = data["infor"]
      @histories = data["histories"]
      @follow_info = data["follow_info"]

    elsif response.code.to_i == 401
      redirect_to logout_path
    else
      redirect_to home_path
    end
  end

  def follow_details

    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.get("/user/my-follow-details", nil, header)

    if response.code.to_i == 200
      data = JSON.parse(response.body)

      redirect_to my_profile_path(failed: true) unless data.present?

      @followers = data["followers"]
      @followings = data["followings"]

    elsif response.code.to_i == 401
      redirect_to logout_path
    else
      redirect_to my_profile_path(failed: true)
    end
  end

  def profile

    unless params[:id].present?
      redirect_to home_path 
      return
    end

    body = {
      target_user_id: params[:id]
    }
    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.post("/user/profile", body, header)

    if response.code.to_i == 200
      data = JSON.parse(response.body)

      @current_user = data["infor"]
      @histories = data["histories"]
      @follow_info = data["follow_info"]
      @is_following = data["is_following"]

    elsif response.code.to_i == 401
      redirect_to logout_path
    else
      redirect_to home_path
    end
  end


  #actions

  def play_one_player_game

  end

  def play_two_players_game

  end

  def follow
    unless params[:id].present?
      redirect_back(fallback_location: root_path)
      return
    end

    body = {
      target_user_id: params[:id]
    }
    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.post("/user/follow", body, header)

    if response.code.to_i == 200
      redirect_to profile_path(id: params[:id])
    elsif response.code.to_i == 401
      redirect_to logout_path
    else
      redirect_back(fallback_location: root_path)
    end
  end

  def unfollow
    unless params[:id].present?
      redirect_back(fallback_location: root_path)
      return
    end

    body = {
      target_user_id: params[:id]
    }
    header = { Authorization: cookies[:nppoker_auth_token] }

    response = APIService.post("/user/unfollow", body, header)

    if response.code.to_i == 200
      redirect_to profile_path(id: params[:id])
    elsif response.code.to_i == 401
      redirect_to logout_path
    else
      redirect_back(fallback_location: root_path)
    end
  end
end
