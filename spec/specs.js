describe('Game', function() {

  describe('createDeck', function() {
    it("creates deck of 52 cards", function() {
      // var game = Object.create(Game);
      deck = game.createDeck();
      expect(deck.length).to.equal(52);
    });
  });

  describe('startGame', function() {
    it("creates game object containing a player and dealer", function() {
      // var game = Object.create(Game);
      game.startGame();
      expect(game.deck.length).to.equal(52);
    });
  });

  describe('deal', function() {
    it("should give player and dealer two cards each", function() {
      // var game = Object.create(Game);
      game.startGame();
      game.deal();
      expect(game.player.hand.length).to.equal(2);
    });
  });

  // describe('score', function() {
  //   it("should know score of hand", function() {
  //     // var game = Object.create(Game);
  //     game.startGame();
  //     var card1 = { rank: 5, suit: 0 };
  //     var card2 = { rank: 12, suit: 0 };
  //     game.player.hand = [card1, card2];
  //     game.player.scorify();
  //     expect(game.player.score).to.equal(15);
  //   });
  // });

  describe('busted', function() {
    it("should tell if the hand has busted or not", function() {
      game.startGame();
      var card1 = { rank: 5, suit: 0 };
      var card2 = { rank: 12, suit: 0 };
      var card3 = { rank: 9, suit: 0 };
      game.player.hand = [card1, card2, card3];
      expect(game.player.busted()).to.equal(true);
    });
  });

  describe('dealerDecision', function() {
    it("should hit if score is below 17", function() {
      game.startGame();
      var card1 = { rank: 5, suit: 0 };
      var card2 = { rank: 2, suit: 0 };
      game.dealer.hand = [card1, card2];
      game.dealer.dealerDecision();
      expect(game.dealer.hand.length).to.equal(3);
    });
  });

  describe('hit', function() {
    it("should add one more card to hand", function() {
      game.startGame();
      game.deal();
      game.player.hit();
      expect(game.player.hand.length).to.equal(3)
    });
  });

  describe('maxScore', function() {
    it("should return max score for hand without busting", function() {
      game.startGame();
      var card1 = { rank: "ace", suit: 0 };
      var card2 = { rank: 6, suit: 0 };
      game.player.hand = [card1, card2];
      expect(game.player.maxScore()).to.equal(17);
    });
  });

  describe('endGame', function() {
    it("determines if game is over", function() {
      game.startGame();
      var card1 = { rank: 5, suit: 0 };
      var card2 = { rank: 12, suit: 0 };
      game.dealer.hand = [card1];
      game.player.hand = [card2];
      expect(game.endGame()).to.equal("player wins");
    })
  });
});
