# Credibly Frontend for IS4302

## Setup:
1. yarn install
2. yarn run dev (to start on port 8080)

## Folder Structure
```
/ethereum
|__ /contracts (store smart contracts here)
|__ /artifacts/contracts (where the compiled contracts are)

/pages (routing done here)
|__ index.css (styles for the application)

/src
|__ /components (main components)
|__ /lib (reusable functions for REST calls)
|__ /security 
    |__ checkAuthenticated.tsx (HOC to only allow authenticated users to view pages)
|__ /stores (central stores for the app)
    |__ AppService.ts (Holds logic to make REST calls/ talk to smart contracts)
    |__ AppStore.ts (central main store for logic)
    |__ UIState.ts (store for UI related state)
    |__ WalletStore.ts (Set blockchain network params and calls functions to connect to metamask extension)
|__ /wallet (functions to connect to metamask extension: read more under README-WALLET)
|__ custom.css (more styles, can be changed)
|__ settings.ts (constants stored here)
```


