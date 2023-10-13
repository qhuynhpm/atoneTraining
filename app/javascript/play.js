// remap jQuery to $
import jquery from "jquery";

window.jQuery = jquery;

window.$ = jquery;

$(document).ready(function () {
  $("#spinner-wrapper").css("display", "none");
  //スタートボタンを押す
  $("#card-input").click(function () {
    $(this).addClass("active");
    $(this).attr("placeholder", "");
    $("#result").css("display", "flex");
    $("#title-wrapper").css("display", "none");
    $("#cards-wrapper").css("display", "flex");
  });

  //UI更新のため
  $("#card-input").on("input", function () {
    $("#result").html("");
    $("#congrat").css("display", "none");
    var formattedInput = formatInput($(this).val());
    $(this).val(formattedInput);
    updateView(formattedInput);
  });

  //判断結果をとる
  $("#card-input").on("change", function () {
    if (validateInput($(this).val())) {
      var requestData = { card_sets: [$("#card-input").val()] };
      getResult(requestData);
    }
  });
});

class Card {
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
  }

  //カードの価値を更新する関数
  update(value) {
    if (value == this.value) {
      this.preValue = this.value;
      return;
    }
    this.preValue = this.value;
    //持ってる価値を価値プールに返す
    Card.cardPool.push(this.value);
    //新たな価値が有効かどうか確認する
    var indexInPool = Card.cardPool.indexOf(value);
    //新たな価値の更新
    if (indexInPool !== -1) {
      this.value = Card.cardPool.splice(indexInPool, 1)[0];
    } else {
      this.value = null;
    }
  }
}

Card.initCardPool();

//定数設定
const API_URL =
  "<%= @env %>" == "development"
    ? "http://127.0.0.1:3000/api/poker/check"
    : "http://0.0.0.0:3000/api/poker/check";
const CARD_FRONT_IMAGE_PREFIX = "/cards/";
const IMAGE_EXT = ".png";

//init cards
var cards = [];
for (var i = 0; i < 5; i++) {
  cards.push(new Card());
}

//半角文字に切り替えの関数
function convertToHalfWidth(str) {
  return str.replace(/[\uFF01-\uFF5E\u3000]/g, function (char) {
    const fullWidth = char.charCodeAt(0);
    const halfWidth = fullWidth - 65248;
    return String.fromCharCode(halfWidth);
  });
}

function formatInput(input) {
  input = convertToHalfWidth(input).replace(/\s+/g, " ").toUpperCase();
  cardTexts = input.trim().split(" ");
  if (cardTexts.length > 5) input = cardTexts.slice(0, 5).join(" ");
  return input;
}

//入力した価値によって、カードの姿を更新するって関数
function updateView(input) {
  var cardTexts = input.split(" ");
  for (let i = 0; i < cards.length; i++) {
    if (!cardTexts[i]) {
      $("#flip-card-inner-" + i).css("transform", "rotateY(0deg)");
      cards[i].update(null);
    } else {
      cards[i].update(cardTexts[i]);
      if (cards[i].value) {
        if (cards[i].value != cards[i].preValue) {
          if (cards[i].preValue != null) {
            $("#flip-card-inner-" + i).css("transform", "rotateY(360deg)");
            setTimeout(() => {
              $("#card-front-image-" + i).attr(
                "src",
                CARD_FRONT_IMAGE_PREFIX + cards[i].value + IMAGE_EXT
              );
              $("#flip-card-inner-" + i).css("transform", "rotateY(180deg)");
            }, 400);
          } else {
            $("#flip-card-inner-" + i).css("transform", "rotateY(180deg)");
            $("#card-front-image-" + i).attr(
              "src",
              CARD_FRONT_IMAGE_PREFIX + cards[i].value + IMAGE_EXT
            );
          }
        }
      } else {
        $("#flip-card-inner-" + i).css("transform", "rotateY(0deg)");
      }
    }
  }
}

//APIをかけるために
function validateInput(input) {
  const isValid = (card) => card.value != null;
  if (cards.every(isValid)) return true;
  return false;
}

function getResult(data) {
  $("#spinner-wrapper").css("display", "block");
  $("#card-input").prop("disabled", true);
  setTimeout(() => {
    $.ajax({
      url: API_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        $("#spinner-wrapper").css("display", "none");
        $("#card-input").prop("disabled", false);
        $("#result").html(response["results"][0]["hand"]);
        if (response["results"][0]["hand"] == "Royal Flush") {
          $("#congrat").css("display", "block");
        }
        //update result to view
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Lỗi:", errorThrown);
        $("#spinner-wrapper").css("display", "none");
        $("#card-input").prop("disabled", false);
      },
    });
  }, 700);
}

//ここからはエフェクトのコントロール
const Confettiful = function (el) {
  this.el = el;
  this.containerEl = null;

  this.confettiFrequency = 3;
  this.confettiColors = ["#EF2964", "#00C09D", "#2D87B0", "#48485E", "#EFFF1D"];
  this.confettiAnimations = ["slow", "medium", "fast"];

  this._setupElements();
  this._renderConfetti();
};

Confettiful.prototype._setupElements = function () {
  const containerEl = document.createElement("div");
  const elPosition = this.el.style.position;

  if (elPosition !== "relative" || elPosition !== "absolute") {
    this.el.style.position = "absolute";
  }

  containerEl.classList.add("confetti-container");

  this.el.appendChild(containerEl);

  this.containerEl = containerEl;
};

Confettiful.prototype._renderConfetti = function () {
  this.confettiInterval = setInterval(() => {
    const confettiEl = document.createElement("div");
    const confettiSize = Math.floor(Math.random() * 3) + 7 + "px";
    const confettiBackground =
      this.confettiColors[
        Math.floor(Math.random() * this.confettiColors.length)
      ];
    const confettiLeft = Math.floor(Math.random() * this.el.offsetWidth) + "px";
    const confettiAnimation =
      this.confettiAnimations[
        Math.floor(Math.random() * this.confettiAnimations.length)
      ];

    confettiEl.classList.add(
      "confetti",
      "confetti--animation-" + confettiAnimation
    );
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    confettiEl.removeTimeout = setTimeout(function () {
      confettiEl.parentNode.removeChild(confettiEl);
    }, 3000);

    this.containerEl.appendChild(confettiEl);
  }, 25);
};

window.confettiful = new Confettiful(document.querySelector(".js-container"));
