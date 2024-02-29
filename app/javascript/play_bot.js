//play_bot.js
import * as VerifyEmail from './verify_email_form.js';
import jquery from "jquery";

window.jQuery = jquery;

window.$ = jquery;

const CARD_FRONT_IMAGE_PREFIX = "/cards/";
const IMAGE_EXT = ".png";

const HANDS_RANKING_NAMES = {
  10: 'Royal Flush',
  9: 'Straight Flush',
  8: 'Four of A Kind',
  7: 'Full House',
  6: 'Flush',
  5: 'Straight',
  4: 'Three of A Kind',
  3: 'Two Pair',
  2: 'Pair',
  1: 'High Card'
};

var socket
var token

window.addEventListener('load', function() {
  console.log('Page loaded.');
});

document.addEventListener('turbo:load', function() {

  token = VerifyEmail.getAuthToken().replace('+', ' ');

  socket = new WebSocket("ws://localhost:3000/bot-socket");

  window.addEventListener('beforeunload', function() {
    socket.close();
  });

  // Connection opened
  socket.addEventListener("open", (event) => {
    $(document).on("click","#start-btn",function(){
      startGame()
    });

    $(document).on("click","#fold-btn",function(){
      callFold()
    });

    $(document).on("click","#check-btn",function(){
      callCheck()
    });

    $(document).on("click","#bet-btn",function(){
      showValueInputSet()
    });

    $(document).on("click","#showhand-btn",function(){
      callShowhand()
    });

    $(document).on("click","#confirm-btn",function(){
      callBet()
    });

    $(document).on("click","#reselect-btn",function(){
      showSelectSet()
    });

    $(document).on("click","#new-game-btn",function(){
      callNewGame()
    });

    $(document).on("click","#exit-btn",function(){
      callExit()
    });

    $("#value-input").on("input", function() {
      $("#bet-amount-label").text("ベット額: " + parseInt($(this).val()).toLocaleString());
    });

    unHideElementById("start-btn")
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);

    msg = JSON.parse(event.data)

    switch (msg.status) {
      case "started":
        initGameScreen()
        break;

      case "losed":
        $('#opponent-best-hand').html(convertRankToName(msg.body.p2_best_hand)).removeAttr('hidden');
        $('#my-best-hand').html(convertRankToName(msg.body.p1_best_hand)).removeAttr('hidden');
        $('#winner-label').html("あなたが降伏しちゃった！").removeAttr('hidden');
        showEndGameSet()
        break;

      case "showdown":
        $('#opponent-best-hand').html(convertRankToName(msg.body.p2_best_hand)).removeAttr('hidden');
        $('#my-best-hand').html(convertRankToName(msg.body.p1_best_hand)).removeAttr('hidden');
        showWinner(msg)
        showEndGameSet()
        break;

      case "call":
        showSelectSet()
        break;

      case "check":
        showSelectSet()
        break;

      case "failed":
        window.alert(msg.error)
        window.location.href = "https://localhost:3001/home"
        break;

      case "Backtrace":
        break;

      case "Unauthorized":
        window.location.href = "https://localhost:3001/logout";
        break;

      default:
    }

    if (msg.body.stage) {
      $('#game-stage').html(convertToStageName(msg.body.stage))
    }

    if (msg.body.bet_value) {
      $('#bet-amount').html(msg.body.bet_value.toLocaleString())
    }

    //update wallet balance
    if (msg.body.player1_wallet_balance) {
      $('#balance-label').html("残高: " + msg.body.player1_wallet_balance.toLocaleString())
    }

    if (msg.body.player1_cards && msg.body.player1_cards.length > 0) {
      showCards("my", msg.body.player1_cards);
    }

    if (msg.body.player2_cards && msg.body.player2_cards.length > 0) {
      showCards("opponent", msg.body.player2_cards);
    }

    if (msg.body.community_cards && msg.body.community_cards.length > 0) {
      showCards("community", msg.body.community_cards);
    }

    if (msg.body.player1_wallet_balance) {
      $("#value-input").attr("max", parseInt(msg.body.player1_wallet_balance));
    }
  });

  // Server-side is closed handle
  socket.addEventListener("close", (event) => {
    window.location.href = "https://localhost:3001/home"
  });

  socket.addEventListener("error", (event) => {
    window.alert(event.data)
  });
});

function startGame() {
  let data = {
    "token": VerifyEmail.getAuthToken().replace('+', ' ')
  }
  socket.send(JSON.stringify(data));
}

function hideElementById(id) {
  let hiddenElement = document.getElementById(id);
  hiddenElement.setAttribute("hidden", true);
}

function unHideElementById(id) {
  let hiddenElement = document.getElementById(id);
  hiddenElement.removeAttribute("hidden");
}

function showCards(target, cards) {
  cards.forEach(function(card, index) {
    $(`#${target}-card-${index}`).attr("src", CARD_FRONT_IMAGE_PREFIX + reverseLastChar(card) + IMAGE_EXT);
    $(`#${target}-card-${index}`).removeAttr('hidden');
  });
}

function callFold() {
  let data = {
    event: "fold"
  }
  socket.send(JSON.stringify(data));
}

function callCheck() {
  let data = {
    event: "check"
  }
  socket.send(JSON.stringify(data));
}


function callShowhand() {
  let data = {
    event: "showhand"
  }
  socket.send(JSON.stringify(data));
}

function callBet() {
  let betAmount = $("#value-input").val();
  let data = {
    event: "bet",
    amount: betAmount
  }
  socket.send(JSON.stringify(data));
}

function callNewGame() {
  let data = {
    event: "newgame"
  }
  socket.send(JSON.stringify(data));
}

function callExit() {
  let data = {
    event: "exit"
  }
  socket.send(JSON.stringify(data));
}

function showValueInputSet() {
  unHideElementById("value-input");
  unHideElementById("confirm-btn");
  unHideElementById("reselect-btn");
  unHideElementById("bet-amount-label");

  hideElementById("fold-btn");
  hideElementById("check-btn");
  hideElementById("bet-btn");
  hideElementById("showhand-btn");
  hideElementById("new-game-btn");
  hideElementById("exit-btn");
}

function showSelectSet() {
  hideElementById("value-input");
  hideElementById("confirm-btn");
  hideElementById("reselect-btn");
  hideElementById("new-game-btn");
  hideElementById("exit-btn");
  hideElementById("bet-amount-label");

  unHideElementById("fold-btn");
  unHideElementById("check-btn");
  unHideElementById("bet-btn");
  unHideElementById("showhand-btn");
}

function showEndGameSet() {
  unHideElementById("new-game-btn");
  unHideElementById("exit-btn");

  hideElementById("value-input");
  hideElementById("confirm-btn");
  hideElementById("reselect-btn");
  hideElementById("fold-btn");
  hideElementById("check-btn");
  hideElementById("bet-btn");
  hideElementById("showhand-btn");
  hideElementById("bet-amount-label");
}

function showBestHand() {
  unHideElementById("opponent-best-hand");
  unHideElementById("my-best-hand");
}

function hideBestHand() {
  hideElementById("opponent-best-hand");
  hideElementById("my-best-hand");
}

function showWinner(msg) {
  if (msg.body.winner == 1) {
    $('#winner-label').html("あなたは待ちました！").removeAttr('hidden');
  }
  else {
    $('#winner-label').html("あなたは負けました！").removeAttr('hidden');
  }
}

function initGameScreen() {
  hideElementById("start-btn");
  hideElementById("start-error-label")
  hideElementById("opponent-best-hand")
  hideElementById("my-best-hand")
  hideElementById("winner-label")
  hideElementById("community-card-0")
  hideElementById("community-card-1")
  hideElementById("community-card-2")
  hideElementById("community-card-3")
  hideElementById("community-card-4")
  $(`#opponent-card-0`).attr("src", CARD_FRONT_IMAGE_PREFIX + "back" + IMAGE_EXT);
  $(`#opponent-card-1`).attr("src", CARD_FRONT_IMAGE_PREFIX + "back" + IMAGE_EXT);

  unHideElementById("root-wrapper");
  showSelectSet()
}

function reverseLastChar(str) {
  if (str.length > 1) {
    return str.slice(-1) + str.slice(0, -1);
  } else {
    return str;
  }
}

function convertToStageName(numb) {
  switch(parseInt(numb)) {
    case 0:
      return "準備中";
    case 1:
      return "BLIND";
    case 2:
      return "FLOP";
    case 3:
      return "TURN";
    case 4:
      return "RIVER";
    case 5:
      return "SHOW DOWN";
    default:
      return "....."
  }
}

function convertRankToName(rank) {
  return HANDS_RANKING_NAMES[rank] || 'Unknown Rank';
}
