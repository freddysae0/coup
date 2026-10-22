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

The WebSocket URL is chosen at runtime: on HTTPS the client uses
`wss://<host>/ws` (a reverse proxy forwards it to the backend), on plain HTTP
it uses `ws://<host>:8000` (localhost, your LAN IP or the server IP).
Set `NEXT_PUBLIC_WS_URL` at build time to override it. Each browser tab is a different player, so
you can test a whole game alone with several tabs.

# Lint and test   

```bash
npm run lint && npm run test

```

## Deploy on Ploi

Production runs at <https://coup.freddysaez.es> on a [Ploi](https://ploi.io)
server with Docker, next to the backend (<https://coup-back.freddysaez.es>).
Nginx (managed by Ploi) terminates TLS and proxies to the container, which only
listens on `127.0.0.1:3000`. The image is a Next.js `standalone` build.

One-time setup:

1. Create the site `coup.freddysaez.es` in Ploi, install this repository on the
   `master` branch and add a Let's Encrypt certificate (the site directory needs
   a `public/` folder, which this repo already has). Leave **Quick deploy off**.
2. Create `.env` in the site directory from `.env.example`. It only holds
   `NEXT_PUBLIC_WS_URL`, which is baked into the bundle at build time.
3. Deploy script:

   ```bash
   set -e
   cd /home/ploi/coup.freddysaez.es
   git fetch origin master
   TARGET="${SHA:-origin/master}"
   git merge-base --is-ancestor "$TARGET" origin/master
   git checkout --force --detach "$TARGET"
   docker compose up -d --build --remove-orphans
   docker image prune -f
   echo "Deployed $(git rev-parse --short HEAD)"
   ```

4. Nginx: replace the PHP `location` blocks with a proxy to the container:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

5. Copy the deploy webhook URL from the site's *Repository* tab into the GitHub
   secret `PLOI_DEPLOY_WEBHOOK`. Every push to `master` then runs lint, tests
   and a build and, if green, deploys that exact commit.
