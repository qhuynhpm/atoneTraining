# frozen_string_literal: true

require 'grape'
require_relative './helpers/poker_helper'
module Poker
  class API < Grape::API
    version 'v1', using: :header, vendor: 'qhuynh'
    format :json
    prefix :api

    helpers PokerHelper

    resource :poker do
      desc 'Evaluate card set'
      params do
        requires :card_sets, type: Array[String], desc: 'Sets of five cards'
      end
      post :check do
        evaluate_card_sets(params[:card_sets])
      end
    end
  end
end
