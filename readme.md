solo-system/
│
├── server/                 ← Backend (Node + Express)
│   ├── server.js
│   ├── config.js
│   ├── models/
│   │   ├── User.js
│   │   └── AdminSettings.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── workout.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── utils/
│       └── rankCalculator.js
│
└── client/                 ← React Frontend (Solo UI)
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/
        │   └── axios.js
        ├── pages/
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        ├── components/
        │   ├── RankCard.jsx
        │   ├── StatPanel.jsx
        │   ├── WorkoutCard.jsx
        │   └── XPBar.jsx
        └── styles/
            ├── theme.css
            ├── hud.css
            └── animations.css
"# soloV1" 
