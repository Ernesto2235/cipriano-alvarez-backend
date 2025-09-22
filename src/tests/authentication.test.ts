import { afterAll, beforeAll, jest } from "@jest/globals"
import {describe,expect,test} from "@jest/globals"
import request from "supertest"
import {app} from "../app.ts"
import { CloseDatabase,startServer,DatabaseConnection } from "../app.ts"
import {server} from "../app.ts"

beforeAll(async ()=>{
    await DatabaseConnection()
})

// this block of code is for test cases that are supposed to pass for the auth controller
test("create user function, should return a 201 status code", async ()=>{
    let user = {email:process.env.USER_EMAIL,password:process.env.USER_PASSWORD,secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201)

})

test("login function, should return a 200 status code", async ()=>{
    let user = {email:process.env.USER_EMAIL,password:process.env.USER_PASSWORD,secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    
})
test("login function should return an error code 403 for invalid secret",async  ()=>{
    let user = {email:process.env.USER_EMAIL,password:process.env.USER_PASSWORD,secret:"12345"};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(403)
})
test("login function should return an error code 400 for no email",async  ()=>{
    let user = {password:process.env.USER_PASSWORD,secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(400)
})
test("login function should return an error code 400 for no password",async  ()=>{
    let user = {email:process.env.USER_EMAIL,secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(400)
})
test("login function should return an error code 404 for user not found",async  ()=>{
    let user = {email:"cipriano.alvarez3@gmail.com",password:process.env.USER_PASSWORD,secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(404)
})
test("login function should return an error code 401 for invalid password",async  ()=>{
    let user = {email:process.env.USER_EMAIL,password:"password123!",secret:process.env.APP_SECRET};
    let response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(401)
})
test("delete user function,should return a 200 status code", async ()=>{
    let response = await request(app).delete("/auth/delete/"+process.env.USER_EMAIL+"/"+process.env.APP_SECRET);
    expect(response.statusCode).toBe(200)
}) 



// this block of code is for test cases that are supposed to fail for the auth controller

//cleanup
afterAll(async () =>{
    await CloseDatabase()
    server.close()
    console.log("finished authentication tests")
})
