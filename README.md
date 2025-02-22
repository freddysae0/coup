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
