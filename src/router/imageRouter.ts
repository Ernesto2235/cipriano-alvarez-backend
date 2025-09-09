import express from "express"
import { getImage } from "../controllers/imageController"

export default function imageRouter(router: express.Router) {
    router.get("/images/:filename", getImage);
}