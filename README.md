Basic Skill:
1. html, css, js
2. reactjs
3. laravel
4. springboot
5. sql databases
6. docker






before creating table, please create your own database!

1. users (sequelize-cli model:generate --name users --attributes fullName:string,email:string,phone:string,gender:string,location:string,image:string,role:string)
2. products (sequelize-cli model:generate --name products --attributes productName:string,quantity:integer,price:integer,img:string,userId:integer)
3. transactions (sequelize-cli model:generate --name transactions --attributes status:string,customerId:integer,sellerId:integer,quantityProduct:integer,productId:integer,totalPrice:integer)
