


var game = {
  startGame: function() {
    this.deck = this.createDeck();
    this.player = Object.create(Person);
    this.dealer = Object.create(Person);
    this.player.init();
    this.dealer.init();
  },

  createDeck: function() {
    var deck = [];
    for(var suit=0; suit<4; suit++) {
      for(var rank=2; rank<=13; rank++) {
        var card = { rank: rank, suit: suit };
        deck.push(card);
      }
      var card = { rank: "ace", suit: suit };
      deck.push(card);
    }
    return deck;
  },

  deal: function() {
    var index;
    for(var i=0;i<2;i++) {
      index = Math.floor(Math.random() * this.deck.length);
      this.player.hand.push(this.deck[index]);
      this.deck.splice(index,1);
      index = Math.floor(Math.random() * this.deck.length);
      this.dealer.hand.push(this.deck[index]);
      this.deck.splice(index,1);
    }
  },

  endGame: function() {
    if (this.player.busted()) { return "dealer wins"; }
    if (this.dealer.busted()) { return "player wins"; }
    if (this.player.maxScore() > this.dealer.maxScore()) { return "player wins"; }
    if (this.dealer.maxScore() > this.player.maxScore()) { return "dealer wins"; }
    else { return "tie"; }
  }

};

var Person = {
  init: function() {
    this.hand = [];
    this.score = 0;
  },

  busted: function() {
    var score = 0;
    var value = 0;
    this.hand.forEach(function(card) {
      value = card.rank;
      if (value === "ace") { value=1; }
      if (value > 10) { value=10; }
      score += value;
    });
    if (score > 21) { return true; }
    return false;
  },

  hit: function() {
    var index = Math.floor(Math.random() * game.deck.length);
    this.hand.push(game.deck[index]);
    game.deck.splice(index,1);
  },

  dealerDecision: function() {
    var score = 0;
    var value = 0;
    this.hand.forEach(function(card) {
      value = card.rank;
      if (value === "ace") { value=11; }
      if (value > 10) { value=10; }
      score += value;
    });
    if (score < 17) {
      this.hit();
    }
  },

  maxScore: function() {
    var score = 0;
    var value = 0;

    // first try scoring one ace as 11 (other aces as 1)
    var firstAce = true;
    this.hand.forEach(function(card) {
      value = card.rank;
      if (value > 10) { value = 10; }
      if (value === "ace") {
        if (firstAce) { score += 11; firstAce = false; }
        else { score += 1; }
      } else { score += value; } // if not ace, just add card's value
    });

    // if scoring one ace as 11 puts score over 21, recount score with all aces as 1
    if (score > 21) {
      score = 0;
      value = 0;
      this.hand.forEach(function(card) {
        value = card.rank;
        if (value === "ace") { value=1; }
        if (value > 10) { value=10; }
        score += value;
      });
    }

    return score;
  },

  displayCard: function(person, card) {
    if (card === "cardBack") {
      var filename = "b1fv";
    } else {
      if (card.suit===0) {suitTxt="clubs";}
      if (card.suit===1) {suitTxt="diamonds";}
      if (card.suit===2) {suitTxt="hearts";}
      if (card.suit===3) {suitTxt="spades";}
      if (card.rank==="ace") {
        rankTxt="14";
      } else {
        rankTxt = card.rank.toString();
      }
      var filename = rankTxt + suitTxt;
    }
    $("#" + person).append("<figure><img src='img/" + filename + ".png'></figure>");
  }

};

$(document).ready(function() {
  $("#deal").click(function(event) {
    $("#end-game").hide();
    $("#hit").show();
    $("#stand").show();
    game.startGame();
    game.deal();

    $("#dealer").empty();
      game.dealer.displayCard("dealer", game.dealer.hand[0])
      game.dealer.displayCard("dealer", "cardBack")


    $("#player").empty();
    game.player.hand.forEach(function(card) {
      game.player.displayCard("player", card)
    });
  });

  $("#hit").click(function(event) {
    game.player.hit();
    var newCard = game.player.hand[game.player.hand.length-1];
    game.player.displayCard("player", newCard);
    if(game.player.busted()) {
      $("#end-game").text("Player is bust!");
      $("#end-game").show();
      $("#hit").hide();
      $("#stand").hide();
    }
  });

  $("#stand").click(function(event) {

    // flip dealer's card
    $("#dealer figure").filter(":last").remove();
    game.dealer.displayCard("dealer", game.dealer.hand[1]);

    while (game.dealer.maxScore() < 17) {
      game.dealer.hit();
      var newCard = game.dealer.hand[game.dealer.hand.length-1];
      game.dealer.displayCard("dealer", newCard);
    }
    var winner = game.endGame();
    $("#end-game").text(winner);
    $("#end-game").show();
    $("#hit").hide();
    $("#stand").hide();
  });

});
