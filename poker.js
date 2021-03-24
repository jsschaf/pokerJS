const readline = require('readline');
const fs = require('fs');

const order = "23456789TJQKA"

const readInterface = readline.createInterface({
  input: fs.createReadStream('poker-hands.txt'),
  output: readHands,
  console: false,
});

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
  //is a straight, flush, T --> A
  return flush(hand) && straight(hand) && (hand[0][0] == 'A')
}

function findRank(hand){
  //TODO ALSO RETURN HIGHEST RANK OF VALUED CARD
  //check in order of provided rank
  if (royalFlush(hand)) return 10;
  if (straight(hand) && flush(hand)) return 9;

  const faces = hand.map((card) => card[0]);
  //four kind
  if (faces[0] == faces[3]) return 8;
  //full house
  if (faces[0] == faces[2] && (faces[3] == faces[4])) return 7;

  if (flush(hand)) return 6;
  if (straight(hand)) return 5;
  if (faces[0] == faces[2]) return 4;
  //two pair
  if (new Set(faces).size == 3) return 3;
  if (faces[0] == faces[1]) return 2;
  return 1;
}

function readHands(line){
  console.log(line)
  //split deal into each players hands
  let p1 = line.split(" ").slice(0, 5)
  let p2 = line.split(" ").slice(5, 10);

  //sort hands based on face order
  p1.sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]));
  p2.sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]));

  // find highest value of each hand
  let rank1 = findRank(p1)
  let rank2 = findRank(p2)

  if (rank1 == rank2){
    console.log("TIE")
  }
  (rank1 > rank2) ? p1_total++ : p2_total++
  console.log(p1_total)
  console.log(p2_total)

}

let p1_total = 0;
let p2_total = 0;

readInterface.on('line', (input) => {
  readHands(input);
});