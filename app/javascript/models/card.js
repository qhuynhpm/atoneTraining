export class Card {
  static cardCount = 0;
  static suits = ["S", "C", "D", "H"];
  static minRank = 1;
  static maxRank = 13;
  static cardPool = [];

  static initCardPool() {
    for (const suit of Card.suits) {
      for (var i = Card.minRank; i <= Card.maxRank; i++) {
        Card.cardPool.push(suit + i);
      }
    }
  }

  constructor() {
    Card.cardCount++;
    this.value = null;
    this.preValue = null;
    this.isRepeated = false;
    this.repeatedValue = null;
    this.isUnidentified = false;
    this.unidentifiedValue = null
  }

  //カードの価値を更新する関数
  update(value) {
    this.isRepeated = false;
    this.repeatedValue = null;
    this.isUnidentified = false;
    this.unidentifiedValue = null
    this.preValue = this.value;
    //持ってる価値を価値プールに返す
    Card.cardPool.push(this.value);
    //新たな価値が有効かどうか確認する
    var indexInPool = Card.cardPool.indexOf(value);
    //新たな価値の更新
    if (indexInPool !== -1) {
      this.value = Card.cardPool.splice(indexInPool, 1)[0];
    } else { //カードの価値は存在しているので、もう一回取ることができない
      this.value = null;
      if (Card.suits.includes(value[0]) && parseInt(value.substring(1)) >= Card.minRank && parseInt(value.substring(1)) <= Card.maxRank) {
        this.isRepeated = true;
        this.repeatedValue = value;
      }
      else {
        this.isUnidentified = true;
        this.unidentifiedValue = value;
      }
    }
  }
}