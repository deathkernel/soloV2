======================
FOLDER STRUCTURE
======================

├── .vscode
│   └── settings.json
├── client
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   └── axios.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── AutomatedTask.jsx
│   │   │   ├── CPMeter.jsx
│   │   │   ├── HunterLicense.jsx
│   │   │   ├── MonarchAura.jsx
│   │   │   ├── MonarchSelection.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── PenaltyAlert.jsx
│   │   │   ├── RankCard.jsx
│   │   │   ├── RankUpOverlay.jsx
│   │   │   ├── StatPanel.jsx
│   │   │   ├── SurpriseQuest.jsx
│   │   │   ├── WorkoutCard.jsx
│   │   │   ├── WorkoutPanel.jsx
│   │   │   └── XPBar.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Admin.jsx
│   │   │   ├── AdminRegister.jsx
│   │   │   ├── CombatMoves.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── Register.jsx
│   │   │   └── WorkoutPage.jsx
│   │   ├── styles
│   │   │   ├── animations.css
│   │   │   ├── auth.css
│   │   │   ├── hud.css
│   │   │   └── theme.css
│   │   └── utils
│   │       ├── rankTheme.js
│   │       └── ThemeContext.jsx
│   └── vite.config.js
├── Diagnose.js
├── package-lock.json
├── package.json
├── readme.md
├── server
│   ├── middleware
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── AdminSettings.js
│   │   └── User.js
│   ├── public
│   │   └── combat-images
│   ├── routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── workout.js
│   ├── server.js
│   └── utils
│       ├── classification.js
│       ├── combatPower.js
│       ├── cpSystem.js
│       ├── difficultyScaler.js
│       ├── penaltyEngine.js
│       ├── rankCalculator.js
│       ├── rankSystem.js
│       ├── statCaps.js
│       └── workoutGenerator.js
└── server_debug_test.js

Running process

Terminal 1

cd client
npm run dev

Terminal 2

cd server
node server.js