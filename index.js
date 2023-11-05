import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "vsqzxzom",
  host: "satao.db.elephantsql.com",
  database: "vsqzxzom",
  password: "HJlnt1F0-FOydiyxPiIg0RnObkL5ehgH",
  port: 5432,
});

db.connect();

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};
// GET home page
app.get('/', (req, res) => {
  res.render("home.ejs");
})
app.get("/capital", async (req, res) => {
  totalCorrect = 0;
  let prev_Ans = "";
  await nextQuestion();
  console.log(currentQuestion);
  res.render("capital.ejs", { question: currentQuestion, prev_Ans: prev_Ans });
});

// POST a new post
app.post("/submit_capital", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  let prev_Ans = "";
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
    prev_Ans = currentQuestion.capital.toLowerCase()
  }
  else {
    prev_Ans = currentQuestion.capital.toLowerCase()
  }

  nextQuestion();
  res.render("capital.ejs", {
    prev_Ans: prev_Ans,
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

//

// GET home page
app.get("/flag", (req, res) => {
  totalCorrect = 0;
  let prev_Ans = "";
  nextQuestion();
 // currentQuestion.flag=getFlagEmoji(currentQuestion.flag);
  console.log(currentQuestion);
  res.render("guess_Flag.ejs", { question: currentQuestion,prev_Ans: prev_Ans });
});

// POST a new post
app.post("/submit_flag", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  let prev_Ans = "";
  if (currentQuestion.flag.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
    prev_Ans = currentQuestion.country.toLowerCase()
  }
  else {
    prev_Ans = currentQuestion.country.toLowerCase()
  }

  nextQuestion();
  res.render("guess_Flag.ejs", {
    prev_Ans: prev_Ans,
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
