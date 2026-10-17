# Coup Game Frontend  

This repository contains the frontend for the **Coup Game**, a multiplayer game where players enter a room and play together in real time.  

## 📌 Game Flow  

1. **Room Creation**  
   - Players join a game room via a dynamic URL: `/game/{uuid}`.  
   - Everyone in the same room will play together.  

2. **Game Start**  
   - Once 2–10 players are in the room, the host starts the game.  

3. **Player Actions**  
   - Players only send intents (`action`, `challenge`, `block`, `pass`, `loseCard`, `exchange`).  
   - The [backend](https://github.com/freddysae0/coup-backend) is authoritative: it validates every move and applies the rules.  

4. **Game State Update**  
   - After every change the backend sends each player their own view of the table (other players' cards stay hidden).  
   - The view includes `options`: exactly what that player can do right now, which is what the UI renders.  
   - Refreshing the page or losing the connection is safe: the client reconnects and gets its seat back.  

## 🛠️ Technologies Used  

- **Frontend**: Next.js 
- **Real-Time Communication**: WebSockets  


## Structure

```
📂 app/                      # Main application directory
 ├── 📂 game/                 # Game-related feature module
 │    ├── 📂 [...slug]/       # Dynamic route folder
 │    │    ├── 📂 components/ # UI components specific to the game
 │    │    │    ├── AllPlayers    # Player list (lobby)
 │    │    │    ├── Lobby         # Invite link, nickname, start
 │    │    │    ├── RunningGame   # Board, actions, responses, card pickers, log
 │    │    ├── page.tsx       # Main page file for the game module
 │    │    ├── layout.tsx     # Layout for the game page
 │    │    ├── rules          # Container for game rules
 │    ├── providers.tsx       # Context providers or global state management
 │
 ├── 📂 config/               # Project configuration files
 ├── 📂 public/               # Static assets
 ├── 📂 shared/               # Reusable code (useCoupSocket.ts: WebSocket + reconnection)
 ├── 📂 styles/               # Global styles
 ├── 📂 types/                # TypeScript type definitions
 │    ├── game.ts             # Game-related types
 │    ├── index.ts            # Type exports
 │
 ├── 📄 .env.production       # Production environment variables
 ├── 📄 .eslintrc.json        # ESLint configuration
 ├── 📄 next.config.js        # Next.js configuration
 ├── 📄 package.json          # Project dependencies
 ├── 📄 Dockerfile            # Docker container setup
 ├── 📄 LICENSE               # Project license
 ├── ... Others
 
```

### Explanation  
- **app/** → Contains the main application logic.  
- **game/** → The game module, structured with routes and components.  
- **shared/** → Reusable code across different parts of the project.  
- **config/** → Global configurations.  
- **styles/** → Styling files.  
- **types/** → TypeScript definitions for strong typing.  
- **Root files** like `.env`, `package.json`, and `next.config.js` for project setup and configuration.  


## 🚀 Installation and Setup  

### Clone the repository  

```bash
git clone https://github.com/freddysae0/coup.git
cd coup
```

### Install dependencies  

```bash
npm install
```

### Start the backend and the development server  

```bash
# in another terminal: https://github.com/freddysae0/coup-backend
git clone https://github.com/freddysae0/coup-backend.git
cd coup-backend && npm install && npm run dev   # ws://localhost:8000

# here
npm run dev   # http://localhost:3000
```

The WebSocket URL comes from `NEXT_PUBLIC_WS_URL` (see `.env.production`).
Without it the client connects to `ws://<current host>:8000`, so friends on
your LAN can join using your IP. Each browser tab is a different player, so
you can test a whole game alone with several tabs.

# Lint and test   

```bash
npm run lint && npm run test

```

