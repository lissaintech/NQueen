const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static("public"));
const file = "scores.json";

app.get("/leaderboard", (req,res)=>{
    const data = JSON.parse(fs.readFileSync(file));
    res.json(data);
});

app.post("/score", (req,res)=>{

const scores = JSON.parse(fs.readFileSync(file));

const newScore = {
name: req.body.name,
level: req.body.level,
time: req.body.time
};

scores.push(newScore);

// sort fastest time first
scores.sort((a,b)=>a.time-b.time);

// keep only top 10
const top10 = scores.slice(0,10);

fs.writeFileSync(file, JSON.stringify(top10,null,2));

res.json({message:"Score saved"});

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});