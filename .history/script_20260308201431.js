let currentLevel = 1;
let maxLevel = 8;

let n;
let board;

let moves = 0;
let seconds = 0;
let timerInterval;

var hintsUsed = 0;
var maxHints = 2;

let unlockedLevel = localStorage.getItem("unlockedLevel") || 1;

// SOUND
const placeSound = new Audio("place.mp3");
const winSound = new Audio("win.mp3");


// SHOW LEVELS

function showLevels(){

document.getElementById("homeScreen").style.display="block";
document.getElementById("gameScreen").style.display="none";
document.getElementById("winScreen").style.display="none";

let levelDiv = document.getElementById("levels");
levelDiv.innerHTML="";

for(let i=1;i<=maxLevel;i++){

let btn=document.createElement("button");
btn.style.animationDelay = (i * 0.08) + "s";

let bestTime = localStorage.getItem("bestTime_"+i);
let size = (i+3)+"x"+(i+3);
let star = bestTime ? "⭐" : "";

btn.innerHTML = `
<div class="levelCard">
<div class="levelTitle">Level ${i}</div>
<div class="levelSize">${size}</div>
<div class="levelMeta">${star} ${bestTime ? bestTime : ""}</div>
</div>
`;

if(i>unlockedLevel){

btn.disabled=true;

btn.innerHTML = `
<div class="levelCard locked">
<div class="levelTitle">Level ${i}</div>
<div class="levelSize">${size}</div>
<div class="levelMeta">🔒 Locked</div>
</div>
`;

}else{

btn.onclick=()=>startLevel(i);

}

levelDiv.appendChild(btn);

}

}


// START LEVEL

function startLevel(level){

currentLevel = level;
n = level+3;

board = new Array(n).fill(-1);

moves = 0;
seconds = 0;

hintsUsed = 0;

// re-enable hint button safely
let hintBtn = document.querySelector("button[onclick='showHint()']");
if(hintBtn){
hintBtn.disabled = false;
}

// reset hint counter display
let hintDisplay = document.getElementById("hintCount");
if(hintDisplay){
hintDisplay.innerText = maxHints;
}

updateMoves();
updateTimerDisplay();

document.getElementById("levelDisplay").innerText=level;

document.getElementById("homeScreen").style.display="none";
document.getElementById("gameScreen").style.display="block";

createBoard();
startTimer();

}


// CREATE BOARD

function createBoard(){

let boardDiv=document.getElementById("board");

boardDiv.innerHTML="";
boardDiv.style.gridTemplateColumns=`repeat(${n},60px)`;

for(let row=0;row<n;row++){

for(let col=0;col<n;col++){

let cell=document.createElement("div");

cell.className="cell "+((row+col)%2==0?"white":"black");

cell.id=row+"-"+col;

cell.onclick=()=>placeQueen(row,col);

boardDiv.appendChild(cell);

}

}

}


// PLACE QUEEN

function placeQueen(row,col){

placeSound.play();

if(board[row]==col)
board[row]=-1;
else
board[row]=col;

moves++;

updateMoves();
updateBoardUI();

setTimeout(()=>{
document.querySelectorAll(".attack").forEach(cell=>{
cell.classList.remove("attack");
});
},2000);

}


// UPDATE BOARD

function updateBoardUI(){

for(let row=0;row<n;row++){

for(let col=0;col<n;col++){

let cell=document.getElementById(row+"-"+col);

cell.classList.remove("attack");

if(board[row]==col){

cell.innerText="♛";

cell.classList.add("queenDrop");

setTimeout(()=>{
cell.classList.remove("queenDrop");
},250);

}else{

cell.innerText="";

}

}

}

document.querySelectorAll(".cell").forEach(cell=>{
cell.classList.remove("attack");
});

for(let r=0;r<n;r++){

if(board[r]==-1) continue;

let c=board[r];

for(let i=0;i<n;i++){

if(i!=r){
let cell=document.getElementById(i+"-"+c);
cell.classList.add("attack");
}

let d1=c+(i-r);
let d2=c-(i-r);

if(d1>=0 && d1<n){
let cell=document.getElementById(i+"-"+d1);
cell.classList.add("attack");
}

if(d2>=0 && d2<n){
let cell=document.getElementById(i+"-"+d2);
cell.classList.add("attack");
}

}

}

}


// TIMER

function startTimer(){

clearInterval(timerInterval);

timerInterval=setInterval(()=>{

seconds++;
updateTimerDisplay();

},1000);

}

function updateTimerDisplay(){

let m=Math.floor(seconds/60);
let s=seconds%60;

document.getElementById("timer").innerText =
String(m).padStart(2,'0')+":"+
String(s).padStart(2,'0');

}


// MOVES

function updateMoves(){

document.getElementById("moves").innerText=moves;

}


// CHECK SOLUTION

function checkSolution(){

if(isValid()){

winSound.play();
launchConfetti();

clearInterval(timerInterval);

saveBestTime();
unlockNextLevel();

document.getElementById("finalTime").innerText=
document.getElementById("timer").innerText;

document.getElementById("gameScreen").style.display="none";
document.getElementById("winScreen").style.display="block";

}else{

alert("Invalid placement");

}

fetch("http://localhost:3000/score",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
level: currentLevel,
time: seconds
})
});

}


// SAVE BEST TIME

function saveBestTime(){

let key="bestTime_"+currentLevel;

let oldTime=localStorage.getItem(key);

if(!oldTime || seconds < timeToSeconds(oldTime)){

localStorage.setItem(key,document.getElementById("timer").innerText);

}

}


// TIME CONVERSION

function timeToSeconds(time){

let parts=time.split(":");

return parseInt(parts[0])*60 + parseInt(parts[1]);

}


// UNLOCK LEVEL

function unlockNextLevel(){

if(currentLevel>=unlockedLevel){

unlockedLevel++;

localStorage.setItem("unlockedLevel",unlockedLevel);

}

}


// VALIDATE

function isValid(){

for(let i=0;i<n;i++){

if(board[i]==-1) return false;

for(let j=i+1;j<n;j++){

if(board[i]==board[j]) return false;

if(Math.abs(board[i]-board[j])==Math.abs(i-j))
return false;

}

}

return true;

}


// AI SOLVER

function solveAI(){

let filled = board.filter(v => v !== -1).length;

if(filled < Math.floor(n/2)){
alert("Try placing at least half the queens before using AI.");
return;
}

seconds += 60;
updateTimerDisplay();

let sol=new Array(n).fill(-1);

if(backtrack(sol,0)){

board=sol;

updateBoardUI();

}

}


// BACKTRACK

function backtrack(sol,row){

if(row==n) return true;

for(let col=0;col<n;col++){

if(isSafe(sol,row,col)){

sol[row]=col;

if(backtrack(sol,row+1)) return true;

}

}

sol[row]=-1;

return false;

}


// SAFE CHECK

function isSafe(sol,row,col){

for(let i=0;i<row;i++){

if(sol[i]==col) return false;

if(Math.abs(sol[i]-col)==Math.abs(i-row))
return false;

}

return true;

}


// HINT SYSTEM

function showHint(){

if(!board){
alert("Start a level first.");
return;
}

if(hintsUsed >= maxHints){
alert("No hints left for this level.");
document.querySelector("button[onclick='showHint()']").disabled=true;
return;
}

let solution = new Array(n).fill(-1);

if(backtrack(solution,0)){

for(let i=0;i<n;i++){

if(board[i]===-1){

board[i]=solution[i];

updateBoardUI();

let cell=document.getElementById(i+"-"+solution[i]);

cell.classList.add("hintGlow");

setTimeout(()=>{
cell.classList.remove("hintGlow");
},800);

hintsUsed++;

let hintDisplay=document.getElementById("hintCount");

if(hintDisplay){
hintDisplay.innerText=maxHints-hintsUsed;
}

break;

}

}

}

}


// RESTART

function restartLevel(){
startLevel(currentLevel);
}


// RESET PROGRESS

function resetProgress(){

if(confirm("Reset all progress?")){

for(let i=1;i<=maxLevel;i++){
localStorage.removeItem("bestTime_"+i);
}

localStorage.setItem("unlockedLevel",1);
unlockedLevel = 1;

showLevels();

}

}


// CONFETTI

function launchConfetti(){

let canvas=document.getElementById("confetti");
let ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let pieces=[];

for(let i=0;i<150;i++){

pieces.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height-200,
size:5+Math.random()*5,
speed:2+Math.random()*3

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

pieces.forEach(p=>{

ctx.fillStyle=`hsl(${Math.random()*360},80%,60%)`;
ctx.fillRect(p.x,p.y,p.size,p.size);

p.y+=p.speed;

});

requestAnimationFrame(draw);

}

draw();

setTimeout(()=>{

ctx.clearRect(0,0,canvas.width,canvas.height);

},2000);

}


// NAVIGATION

function nextLevel(){
startLevel(currentLevel+1);
}

function goHome(){
showLevels();
}


// INIT

showLevels();
loca


// fetch leaderboard

async function loadLeaderboard(){

let res = await fetch("http://localhost:3000/leaderboard");

let data = await res.json();

console.log(data);

}