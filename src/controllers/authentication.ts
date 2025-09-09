import   Express  from "express";
import {createUser} from "../modelsTS/User";
import {getUserByEmail} from "../modelsTS/User";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";


export async function register(req:Express.Request, res:Express.Response) {
    
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({errors: result.array()})
    }
    try{
        const{email,password,secret} = req.body;


        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }
        if(!secret || secret !== process.env.APP_SECRET){
            return res.status(403).json({error:"Invalid secret"});
        }
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(email, hashedPassword);
        res.sendStatus(201).json({message:"User registered successfully", userId: newUser.id});
    }catch (error) {
        console.error("Error during registration:", error);
        res.sendStatus(400)
    }
}

export async function login(req:Express.Request, res:Express.Response) {
    try{
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({errors: result.array()})
        }   



        const {email, password,secret} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }
        if(!secret || secret !== process.env.APP_SECRET){
            console.log(process.env.APP_SECRET);
            console.log(secret);
            return res.status(403).json({error:"Invalid secret"});
        }
        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({error:"Invalid password"});
        }
        // Here you would typically create a session or JWT token
        res.status(200).json({message:"Login successful", userId: user.id});
    }catch (error) {
        console.error("Error during login:", error);
        res.sendStatus(400)
    }
}
