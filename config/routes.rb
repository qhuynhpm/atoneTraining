# frozen_string_literal: true

Rails.application.routes.draw do
  root 'main#home'
  get '/login', to: 'session#login_form', as: :login
  post '/login', to: 'session#login'

  get '/signup', to: "account#signup_form", as: :signup
  post '/signup', to: "account#signup"

  get '/reset-password', to: "account#reset_password_form", as: :reset_password
  post '/reset-password', to: "account#reset_password"

  get '/verify-email', to: "account#verify_email_form", as: :verify_email
  post '/verify-email', to: "account#verify_email"

  get '/home', to: "main#home", as: :home

  get '/my-profile', to: 'main#my_profile', as: :my_profile

  get '/profile', to: 'main#profile', as: :profile
  post '/profile/follow', to: 'main#follow', as: :profile_follow
  post '/profile/unfollow', to: 'main#unfollow', as: :profile_unfollow

  get '/game-history', to: 'main#game_history', as: :game_history

  get '/my-profile/follow-details', to: 'main#follow_details', as: :follow_details

  get '/play/1vs1', to: "main#play_11", as: :play_11

  get '/play/bot', to: "main#play_bot", as: :play_bot

  get '/logout', to: 'session#logout', as: :logout
end
