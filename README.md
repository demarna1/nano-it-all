# Nano-it-all

Win small amounts of Nano in this free-to-play live trivia competition.

## Development Guide

### Prerequisite: install postgres locally and create database

```
brew install postgresql
brew services start postgresql
createdb nanoitall
```

### Install server and client dependencies

```
npm install
cd client && npm install
```

### Migrate database

```
npx sequelize db:migrate
```

### Run app locally

```
npm run dev
```

Access the client at `http://localhost:3000`

## Production Deployment Guide

### Push to heroku to build and deploy app

```
git push heroku master
```

### View production database

```
heroku config
psql <DATABASE_URL>
```

### Migrate database

```
heroku run sequelize db:migrate
```

Access the application at `https://nano-it-all.herokuapp.com`
