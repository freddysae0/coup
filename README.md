# Coup Game Frontend  

This repository contains the frontend for the **Coup Game**, a multiplayer game where players enter a room and play together in real time.  

## 📌 Game Flow  

1. **Room Creation**  
   - Players join a game room via a dynamic URL: `/game/{uuid}`.  
   - Everyone in the same room will play together.  

2. **Game Start**  
   - Once all players are in the room, the frontend sends a signal to the backend to start the game.  

3. **Player Actions**  
   - Players perform actions in the frontend.  
   - These actions are sent to the backend for processing.  

4. **Game State Update**  
   - The backend processes the actions and updates the game state.  
   - The updated game state is then sent back to the frontend so all players can see the changes in real time.  

## 🛠️ Technologies Used  

- **Frontend**: Next.js 
- **Real-Time Communication**: WebSockets  


## Structure

```
📂 app/                      # Main application directory
 ├── 📂 game/                 # Game-related feature module
 │    ├── 📂 [...slug]/       # Dynamic route folder
 │    │    ├── 📂 components/ # UI components specific to the game
 │    │    │    ├── AllPlayers    
 │    │    │    ├── RunningGame   
 │    │    ├── page.tsx       # Main page file for the game module
 │    │    ├── page.utils.ts  # Utility functions for the game page
 │    │    ├── layout.tsx     # Layout for the game page
 │    │    ├── rules          # Container for game rules
 │    ├── providers.tsx       # Context providers or global state management
 │
 ├── 📂 config/               # Project configuration files
 ├── 📂 public/               # Static assets
 ├── 📂 shared/               # Reusable code     (The NAVBAR and ICONS are server side components)
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

Let me know if you need modifications or additional details. 🚀

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

### Start the development server  

```bash
npm run dev
```

# Lint and test   

```bash
npm run lint && npm run test

```

