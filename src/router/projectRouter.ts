import express from 'express';
import {getProject} from '../controllers/projectController.ts';
import {getProjects} from '../controllers/projectController.ts';
import {createNewProject} from '../controllers/projectController.ts';
import {deleteProject} from '../controllers/projectController.ts';
import multer from 'multer';
import path from 'path'
import {body} from "express-validator"
import { param } from 'express-validator';

// Configure multer for file uploads
// This will store uploaded files in the 'images' directory with a unique name
const storage = multer.diskStorage({
    destination:(function(req,file,cb){
        cb(null,process.env.IMAGE_PATH);
    }),
    filename:(function(req,file,cb){
        let ranInt: number = Math.floor(Math.random() * 1000000);
        let extension = path.extname(file.originalname);
        cb(null,Date.now() + '-' + "project-"+ranInt+extension);
    })
})

// Create the multer instance with the storage configuration
// and a file filter to only allow image files
const upload = multer({ 
    storage: storage,
    fileFilter: imageFilter,
});

// Function to filter files based on their MIME type
// This will only allow image files to be uploaded
// If the file is not an image, it will return an error
function imageFilter(req: express.Request, file: Express.Multer.File, cb: Function) {
    if (file.mimetype.startsWith('image/')) {

        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
}

export default function projectRouter(router: express.Router) {
    router.get('/projects/:projectId/:secret',[
        param("projectId").isInt().withMessage('Project ID must be an Int'),
        param("secret").trim().escape()
    ], getProject);
    router.get('/projects/:secret', [
        param("secret").trim().escape()
    ] ,getProjects);
    router.post('/projects/add',[
        body("name").trim().escape(),
        body("description").trim().escape(),
        body("url").optional().isURL().trim(),
        body("date").optional().toDate(),
        body("secret").trim().escape()
    ], upload.single('image'),createNewProject);
    router.delete("/projects/delete/:name/:secret",[
        param("name").trim().escape(),
        param("secret").trim().escape()
    ],deleteProject)
    return router;
}

