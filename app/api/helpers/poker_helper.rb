# frozen_string_literal: true

module PokerHelper
  VALID_SUITS_SET = %w[S C D H].freeze
  VALID_RANKS_SET = (1..13).to_a

  def validate_card_set(input)
    half_width_input = input.tr('０-９ａ-ｚＡ-Ｚ．＠−', '0-9a-zA-Z.@-').gsub(/　/, ' ').upcase
    cards = half_width_input.split ' '
    return { 'is_valid' => false, 'msg' => 'カード5枚だけで入力してください!' } if cards.length != 5

    suits = []
    ranks = []

    wrong_card_indexs = []
    wrong_cards = []

    cards.each_with_index do |card, index|
      unless PokerHelper::VALID_SUITS_SET.include?(card[0]) && PokerHelper::VALID_RANKS_SET.include?(card[1..].to_i)
        wrong_card_indexs << index
        wrong_cards << card
      else
        suits << card[0]
        ranks << card[1..].to_i
      end
    end

    if wrong_card_indexs.length.positive?
      wrong_card_indexs_string = wrong_card_indexs.map { |num| (num + 1).to_s }.join ', '
      return { 'is_valid' => false, 'msg' => "#{wrong_card_indexs_string}番カード指定文字が不正です. (#{wrong_cards.join ', '})" }
    end

    { 'is_valid' => true, 'suits' => suits, 'ranks' => ranks }
  end

  def evaluate_a_card_set(suits, ranks)
    suits.uniq!

    if suits.length == 1
      if ranks.sort == [1, 10, 11, 12, 13]
        'Royal Flush'
      elsif (ranks.uniq.length == 5) && (ranks.min == ranks.max - 4)
        'Straight Flush'
      else
        'Flush'
      end
    else
      rank_counts = ranks.group_by { |rank| ranks.count(rank) }

      if rank_counts.keys.max == 4
        'Four of a kind'
      elsif rank_counts.keys.sort == [2, 3]
        'Full House'
      elsif (ranks.min == ranks.max - 4) || (ranks.sort == [1, 10, 11, 12, 13])
        'Straight'
      elsif rank_counts.keys.max == 3
        'Three of a kind'
      elsif rank_counts[2]
        return 'Two Pair' if rank_counts[2].length == 4

        'One Pair'

      else
        'High Card'
      end
    end
  end

  def evaluate_card_sets(card_sets)
    results = []
    errors = []

    card_sets.each do |card_set|
      validate_result = validate_card_set card_set
      if validate_result['is_valid']
        hand = evaluate_a_card_set validate_result['suits'], validate_result['ranks']
        results << { 'card_set' => card_set, 'hand' => hand }
      else
        errors << { 'card_set' => card_set, 'msg' => validate_result['msg'] }
      end
    end

    { 'results' => results, 'errors' => errors }
  end
end
