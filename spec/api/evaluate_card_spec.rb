require 'rails_helper'
RSpec.describe "Poker::API" do
  describe "POST /api/poker/check" do
    before do
      @api_url = '/api/poker/check'
    end

    context "without attached body" do
      it "should return a status code 400" do
        post @api_url
        expect(response.status).to eq(400)
      end
    end

    context "not match body's format" do #not include "card_sets" -> Array[String]
      it "should return a status code 400" do
        post @api_url, params: {"card": [" s1   s2  s3   s4   s5"]}, as: :json
        expect(response.status).to eq(400)
      end
    end

    context "match body's format" do #include "card_sets" -> Array[String]
      it 'should returns a status code 201' do
        post @api_url, params: {"card_sets": [" s1   s2  s3   s4   s5"]}, as: :json
        expect(response.status).to eq(201)
      end

      #Logic test from here
      context "having no card set was sent" do
        it "should return empty in results and errors" do
          post @api_url, params: {"card_sets": []}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to be_empty
          expect(json[:errors]).to be_empty
        end
      end

      context "having at least one card set sent - logic test" do
        it "has less than 5 cards in a set" do
          post @api_url, params: {"card_sets": ["s1 s2 s3 s4"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to be_empty
          expect(json[:errors]).to eq([
            {
              card_set: "s1 s2 s3 s4",
              msg: "カード5枚だけで入力してください!"
            }
          ])
        end

        it "has more than 5 cards in a set" do
          post @api_url, params: {"card_sets": ["s1 s2 s3 s4 s5 s6"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to be_empty
          expect(json[:errors]).to eq([
            {
              card_set: "s1 s2 s3 s4 s5 s6",
              msg: "カード5枚だけで入力してください!"
            }
          ])
        end

        it "has more than one spaces between cards" do
          post @api_url, params: {"card_sets": [" s1  s2 s3  s4 s5  "]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: " s1  s2 s3  s4 s5  ",
              hand: "Straight Flush"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has an unknown card in a set" do
          post @api_url, params: {"card_sets": ["s1  f2 s3  s4 s5"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to be_empty
          expect(json[:errors]).to eq([
            {
              card_set: "s1  f2 s3  s4 s5",
              msg: "2番カード指定文字が不正です. (f2)"
            }
          ])
        end

        it "has a high-card-hand" do
          post @api_url, params: {"card_sets": ["s1 c2 c5 h7 d8"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 c2 c5 h7 d8",
              hand: "High Card"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has an one-pair-hand" do
          post @api_url, params: {"card_sets": ["s1 d1 c5 h7 d8"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 d1 c5 h7 d8",
              hand: "One Pair"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has a two-pair-hand" do
          post @api_url, params: {"card_sets": ["s1 d1 c5 d5 d8"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 d1 c5 d5 d8",
              hand: "Two Pair"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has a three-of-a-kind-hand" do
          post @api_url, params: {"card_sets": ["s1 d1 c1 d5 d8"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 d1 c1 d5 d8",
              hand: "Three of a kind"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has straight-hand" do
          post @api_url, params: {"card_sets": ["s10 s1 c11 s12 s13"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s10 s1 c11 s12 s13",
              hand: "Straight"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has a flush-hand" do
          post @api_url, params: {"card_sets": ["s1 s3 s5 s7 s9"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 s3 s5 s7 s9",
              hand: "Flush"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has fullhouse-hand" do
          post @api_url, params: {"card_sets": ["s1 c1 d1 s7 c7"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 c1 d1 s7 c7",
              hand: "Full House"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has four-of-a-kind-hand" do
          post @api_url, params: {"card_sets": ["s1 c1 d1 h1 c7"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 c1 d1 h1 c7",
              hand: "Four of a kind"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has straight-flush-hand" do
          post @api_url, params: {"card_sets": ["s1 s2 s3 s4 s5"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s1 s2 s3 s4 s5",
              hand: "Straight Flush"
            }
          ])
          expect(json[:errors]).to be_empty
        end

        it "has royal-flush-hand" do
          post @api_url, params: {"card_sets": ["s10 s1 s11 s12 s13"]}, as: :json
          expect(response.status).to eq(201)
          json = JSON.parse(response.body).deep_symbolize_keys
          expect(json[:results]).to eq([
            {
              card_set: "s10 s1 s11 s12 s13",
              hand: "Royal Flush"
            }
          ])
          expect(json[:errors]).to be_empty
        end
      end
    end
  end
end
