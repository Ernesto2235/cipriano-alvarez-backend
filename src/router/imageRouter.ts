import express from "express"
import { getImage } from "../controllers/imageController.ts"

export default function imageRouter(router: express.Router) {
    router.get("/images/:filename", getImage);
}