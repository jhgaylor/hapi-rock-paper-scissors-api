'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

var moves = [
  'rock',
  'paper',
  'scissors'
];

var endpoints = moves.map( move => {
  return `/${move}`;
});

// return a random one of 'rock', 'paper', or 'scissors'
function selectAIMove () {
  var roll = Math.floor(Math.random() * moves.length);
  return moves[roll];
}

// returns true if player won
// returns false if ai won
// returns null if tie
function playGameAgainstAI (playerMove) {
  var aiMove = selectAIMove();
  console.log(playerMove, aiMove);
  var results = {
    aiMove: aiMove,
    playerMove: playerMove,
    isWin: null
  };
  if (aiMove === playerMove) {
    return results;
  }
  if (aiMove === 'rock') {
    // this is a win for the player only if they did not play scissors into rock
    // we have already ruled out all ties so the player can't be rock
    results.isWin = (playerMove !== 'scissors');
    return results;
  }
  if (aiMove === 'scissors') {
    // this is a win for the player if he is not paper
    results.isWin = (playerMove !== 'paper');
    return results;
  }
  if (aiMove === 'paper') {
    results.isWin = (playerMove !== 'rock');
    return results;
  }
}

function humanReadableWinResult (isWin) {
  if (isWin === null) {
    return "tie";
  }
  if (isWin) {
    return "Win!";
  }
  return "Loss!";
}


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply({endpoints: endpoints});
    }
});

endpoints.map( (endpoint, index) => {
  server.route({
    method: 'GET',
    path: endpoint,
    handler: function (request, reply) {
      var results = playGameAgainstAI(moves[index]);
      results.humanReadable = humanReadableWinResult(results.isWin)
      reply(results);
    }
  })
});


server.start(() => {
    console.log('Server running at:', server.info.uri);
});
