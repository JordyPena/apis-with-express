const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

// drill 1

//get is a request type 
app.get('/sum', (req, res) => {
  //a and b are stings because request is a string because its coming from the url which is a string
  const {a, b} = req.query
  const c = parseInt(a) + parseInt(b) 
  
  res.send(`The sum of ${a} and ${b} is ${c}`)


  
}) 

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/cipher', (req, res) => {
  const {text, shift} = req.query
  const newShift = parseInt(shift)
  console.log(req.query)
  const characters = text.split("")
  console.log(characters)
  let crypted = ""
  for (let i = 0; i < characters.length; i++) {
    let letter = characters[i]
    let number = letter.charCodeAt(0) + newShift
    //65 happens to be A in ASCII
    if ( number > 90) {
      number = number - 26
    }

    let newCharacter = String.fromCharCode(number)
    crypted += newCharacter
    // return single characters into a string 
    
    
  }
  console.log(crypted)
  res.end(crypted)
});

app.get('/lotto', (req, res) => {
  const { numbers } = req.query; 

  // validation: 
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if(!numbers) {
    return res
      .status(400)
      .send("numbers is required");
  }

  if(!Array.isArray(numbers)) {
    return res
      .status(400)
      .send("numbers must be an array");
  }

  const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
  
  if(guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }      

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }


  // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});


app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});
