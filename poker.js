/* 
Poker Hand Sorter
by Jacqui Schafer 
25/3/2021 
*/

const readline = require('readline');
const order = "23456789TJQKA";

function flush(hand){
  //create a set to track unique suits
  const suits = new Set(hand.map(card => {
    return card[1]
}))
  return ((suits.size == 1) ? true : false);
}

function straight(hand){
  //convert each face to a number, and add index in array 
  faces = new Set(hand.map((card, index) => {
    return order.indexOf(card[0]) + index
  }))
  return ((faces.size == 1) ? true : false);
}

function royalFlush(hand){
  //is a straight, flush, highest card A
  return flush(hand) && straight(hand) && (hand[0][0] == 'A')
}

function findRank(hand){

  //track face value of each hand
  const faces = hand.map((card) => order.indexOf(card[0]));
  let high_card = faces[0];

  // royal flush
  if (royalFlush(hand)) return [10, high_card];

  // straight flush
  if (straight(hand) && flush(hand)) return [9, high_card];

  //four kind
  if ((faces[0] == faces[3]) || (faces[1] == faces[4])) return [8, faces[2]];

  //full house
  if (new Set(faces).size == 2) return [7, faces[2]];

  // flush
  if (flush(hand)) return [6, high_card];

  // straight
  if (straight(hand)) return [5, high_card];

  // three kind
  if ((faces[0] == faces[2]) || (faces[1] == faces[3]) || (faces[2] == faces[4])) return [4, faces[2]];

  //two pair
  if (new Set(faces).size == 3) return [3, faces[1]];

  // pair
  for (let i = 0; i < faces.length - 1; i++){
    if (faces[i] == faces[i+1]){
      return [2, faces[i]];
    }
  }
  //high card
  return [1, high_card];
}

function readHands(line){
  //split deal into each players hands

  let p1 = line.split(" ").slice(0, 5)
  let p2 = line.split(" ").slice(5, 10);

  //sort hands based on face order
  p1.sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]));
  p2.sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]));

  // find highest rank & value of each hand
  let [rank1, value1] = findRank(p1)
  let [rank2, value2] = findRank(p2)

  // break ties
  if (rank1 == rank2){
    if (value1 == value2){
      //special case for two-pair, compare second pair value
      if (rank1 == 3){
        //second pair is guaranteed at index 3
        if (order.indexOf(p1[3][0]) != order.indexOf(p2[3][0])) {
          order.indexOf(p1[3][0]) > order.indexOf(p2[3][0]) ? p1_total++ : p2_total++;
          return;
        }
      }

      // equal hand values, find highest card
      for (let i = 0; i < p1.length; i++){
        if (order.indexOf(p1[i][0]) == order.indexOf(p2[i][0])) continue;
        order.indexOf(p1[i][0]) > order.indexOf(p2[i][0]) ? p1_total++ : p2_total++;
        return;
      }
      // complete hands were equal, no winner, default to p1 wins
      p1_total++;
    }
    //same rank, different rank value
    (value1 > value2) ? p1_total++ : p2_total++
  }
  else {
    // different ranks
    (rank1 > rank2) ? p1_total++ : p2_total++
  }
}

//track total wins by player
var p1_total = 0;
var p2_total = 0;

const readInterface = readline.createInterface({
  input: process.stdin,
});

// read in lines, and print scores at end of stream
readInterface.on('line', (input) => {
  readHands(input);
}).on('close', () => {
  console.log("Player 1: " + p1_total)
  console.log("Player 2: " + p2_total)
});
