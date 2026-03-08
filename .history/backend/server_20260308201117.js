const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const file = "scores.json";

app.get("/leaderboard", (req,res)=>{
    const data = JSON.parse(fs.readFileSync(file));
    res.json(data);
});

app.post("/score", (req,res)=>{
    const scores = JSON.parse(fs.readFileSync(file));

    scores.push(req.body);

    scores.sort((a,b)=>a.time-b.time);

    fs.writeFileSync(file, JSON.stringify(scores,null,2));

    res.json({message:"Score saved"});
});

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});