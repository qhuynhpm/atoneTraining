class PokerController < ApplicationController
  def play
    @env = ENV['RAILS_ENV']
  end
end
