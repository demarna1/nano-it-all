# Nano-it-all

Win small amounts of Nano in this free-to-play live trivia competition.

## Development Guide

Prerequisite: install postgres locally and create database

```
brew install postgresql
brew services start postgresql
createdb nanoitall
psql nanoitall
```

Install server and client dependencies

```
npm install
cd client && npm install
```

Migrate and seed development database

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

Run app locally

```
npm run dev
```

Access the client at `http://localhost:3000`

## Production Deployment Guide

Log into heroku account

```
heroku login
```

View production database

```
heroku pg:psql
```

Migrate and seed production database (note: seeder file contains the trivia questions and is not committed to source control)

```
NODE_ENV=production DATABASE_URL=$(heroku config:get DATABASE_URL) npx sequelize db:migrate
NODE_ENV=production DATABASE_URL=$(heroku config:get DATABASE_URL) npx sequelize db:seed:all
```

Push to heroku to build and deploy app

```
git push heroku master
```

Access the application at `https://nano-it-all.herokuapp.com`
