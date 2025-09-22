import express from 'express';
import {register} from '../controllers/authentication.ts';
import {login} from '../controllers/authentication.ts';
import { deleteUser } from '../controllers/authentication.ts';
import { body,param } from 'express-validator';

export default function authenticateRouter(router: express.Router){
    router.post('/auth/register',[
        body("email").trim().isEmail(),
        body("password").trim().notEmpty(),
        body("secret").trim().notEmpty()
    ], register);
    router.post('/auth/login',[
        body("email").trim().isEmail(),
        body("password").trim().notEmpty(),
        body("secret").trim().notEmpty()
    ], login);
    router.delete('/auth/delete/:email/:secret',[
        param("email").trim().isEmail(),
        param("secret").trim().notEmpty()
    ],deleteUser)
    return router;
}