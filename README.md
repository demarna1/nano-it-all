# Nano-it-all

Win small amounts of Nano in this free-to-play live trivia competition.

## Developer Getting Started

### Prerequisite: install and start postgres

```
brew install postgresql
brew services start postgresql
```

### Install server and client dependencies

```
npm install
cd client && npm install
```

### Migrate database

```
cd server && npx sequelize db:migrate
```

### Run app locally

```
npm run dev
```

Access the client at `http://localhost:3000`
