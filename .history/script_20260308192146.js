let currentLevel = 1;
let maxLevel = 8;

let n;
let board;

let moves = 0;
let seconds = 0;
let timerInterval;

let unlockedLevel = localStorage.getItem("unlockedLevel") || 1;



// SOUND EFFECTS

const placeSound = new Audio("place.mp3");
const winSound = new Audio("win.mp3");



// SHOW LEVELS SCREEN

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

 // mark attacked cells

 for(let r=0;r<n;r++){

   if(board[r]==-1) continue;

   let c=board[r];

   for(let i=0;i<n;i++){

     // same column
     if(i!=r){
       let cell=document.getElementById(i+"-"+c);
       cell.classList.add("attack");
     }

     // diagonals
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

 document.getElementById("timer").innerText=
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
}



// SAVE BEST TIME

function saveBestTime(){

 let key="bestTime_"+currentLevel;

 let oldTime=localStorage.getItem(key);

 if(!oldTime || seconds < timeToSeconds(oldTime)){

   localStorage.setItem(key,document.getElementById("timer").innerText);
 }
}



// CONVERT MM:SS TO SECONDS

function timeToSeconds(time){

 let parts=time.split(":");

 return parseInt(parts[0])*60 + parseInt(parts[1]);
}



// UNLOCK NEXT LEVEL

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

 let sol=new Array(n).fill(-1);

 if(backtrack(sol,0)){

   board=sol;

   updateBoardUI();
 }
}



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



function isSafe(sol,row,col){

 for(let i=0;i<row;i++){

   if(sol[i]==col) return false;

   if(Math.abs(sol[i]-col)==Math.abs(i-row))
     return false;
 }

 return true;
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


//RESTART

function restartLevel(){
 startLevel(currentLevel);
}

//RESET PROGRESS

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