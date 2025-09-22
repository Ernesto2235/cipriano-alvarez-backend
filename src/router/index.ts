import express from "express";
import authRouter from './authenticate.ts';
import projectRouter from './projectRouter.ts';
import imageRouter from "./imageRouter.ts";

const router = express.Router();

export default function Router() : express.Router {
    // Initialize the authentication and project routers
    
    authRouter(router);
    projectRouter(router);
    imageRouter(router)

    // Add any additional routes or middleware here if needed
    return router;
};