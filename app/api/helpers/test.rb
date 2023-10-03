ranks = [1,2,4,4,4]
suits = ["s","h"]

    if suits.length == 1
      if ranks.sort == [1,10,11,12,13]
        puts "Royal Flush"
      elsif ranks.uniq.length == 5 and ranks.min == ranks.max - 4
        puts "Straight Flush"
      else
        puts "Flush"
      end
    else
      rank_counts = ranks.group_by { |rank| ranks.count(rank) }
      puts rank_counts

      if rank_counts.keys.max == 4
        puts "Four of a Kind"
      elsif rank_counts.keys.sort == [2, 3]
        puts "Full House"
      elsif ranks.min == ranks.max - 4 or ranks.sort == [1,10,11,12,13]
        puts "Straight"
      elsif rank_counts.keys.max == 3
        puts "Three of a Kind"
      elsif rank_counts[2]
        if rank_counts[2].length == 4
          puts "Two Pair"
        else
          puts "One Pair"
        end
      else
        puts "High Card"
      end
    end