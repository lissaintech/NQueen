# N-Queen AI Challenge

An interactive **N-Queens puzzle game** built as a full-stack web application.

Players must place N queens on a chessboard such that **no two queens attack each other**. The application provides hints, an AI solver, multiple difficulty levels, and a leaderboard.

---

## Features

* Multiple puzzle levels (4×4 → 11×11 boards)
* AI solver using **backtracking algorithm**
* Hint system with limited hints per level
* Timer and move counter
* Animated chessboard UI
* Confetti celebration on completion
* Global leaderboard using **Node.js backend**
* Progress persistence using **LocalStorage**

---

## Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript (Vanilla)

**Backend**

* Node.js
* Express.js

**Storage**

* JSON file (`scores.json`) for leaderboard data
* LocalStorage for saving progress

---

## How to Play

1. Select a level.
2. Place queens on the board.
3. Ensure that:

   * No two queens share the same row
   * No two queens share the same column
   * No two queens share the same diagonal
4. Use **Hint** if stuck.
5. Use **AI Solve** if you want the full solution.

---

## AI Algorithm

The AI solver uses a **Backtracking algorithm** to compute valid N-Queens placements.

Steps:

1. Place a queen in the first row.
2. Recursively attempt placements in subsequent rows.
3. Check column and diagonal safety constraints.
4. Backtrack if a placement leads to a conflict.
5. Continue until a valid board configuration is found.

---

## Project Structure

```
NQueen
│
├── backend
│   ├── server.js
│   ├── package.json
│   ├── scores.json
│   │
│   └── public
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       ├── place.mp3
│       └── win.mp3
│
└── README.md
```

---

## Running the Project Locally

### Backend

```bash
cd backend
npm install
node server.js
```

### Open the Game

Visit:

```
http://localhost:3000
```

---

## Live Demo

Deployed application:

```
https://nqueen-cqcx.onrender.com
```

---

## Author

Lissa Nanda

