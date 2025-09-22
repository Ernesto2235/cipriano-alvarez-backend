import express  from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql"
import Router from "./router/index.ts";
import { User } from "./modelsTS/User.ts";
import { Project } from "./modelsTS/ProjectModel.ts";
import  Multer  from "multer";
import multer from "multer";
import path from "path"
import { start } from "repl";



dotenv.config();
export const app = express();
export const sequelize = new Sequelize({
    dialect: MySqlDialect, // Use MySqlDialect for MySQL
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT )|| 3306, // ensure port is a number

    models: [User,Project], // Register your models here
});

export async function DatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export async function CloseDatabase(){
    try{
        await sequelize.close();
        console.log("closed database")
    }catch(error){
        console.log("Unable to close database connection",error)
    }
}

DatabaseConnection();


app.use(cors({
    credentials:true,
}))
app.use(express.static(path.join(__dirname,'images')))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(compression())
app.use(cookieParser());

const PORT = process.env.PORT || 3001

export const server = http.createServer(app);


export async function startServer(){
    server.listen(PORT, () => {
    console.log("Server is running on port "  + PORT);
});
}   
startServer();
app.use("/",Router());