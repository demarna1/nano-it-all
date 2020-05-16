### Sequelize commands

```
npx sequelize-cli init
npx sequelize-cli model:generate --name Account --attributes address:string,name:string,verified:boolean,password:string,sid:string,token:string
npx sequelize-cli model:generate --name Question --attributes question:string,rightanswers:string,wronganswers:string,round:integer,asked:boolean
npx sequelize db:migrate
npx sequelize db:seed:all
```
