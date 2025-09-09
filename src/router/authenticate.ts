import express from 'express';
import {register} from '../controllers/authentication';
import {login} from '../controllers/authentication';
import { body } from 'express-validator';

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
    return router;
}