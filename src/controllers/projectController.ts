import { getProjectById, Project } from "../modelsTS/ProjectModel";
import { getAllProjects } from "../modelsTS/ProjectModel";
import { createProject } from "../modelsTS/ProjectModel";
import express from "express";
import multer from "multer";
import * as fs from "fs"
import { validationResult } from "express-validator";

export async function getProject(req: express.Request, res: express.Response   ) {
    try{
        const {projectId,secret} = req.params;
        if(secret !== process.env.APP_SECRET || !secret){
            return res.status(403).json({error:"Invalid secret"});
        }
        if(!projectId){
            return res.status(400).json({error:"Project ID is required"});
        }
        const project = await getProjectById(parseInt(projectId));
        if(!project){
            return res.status(404).json({error:"Project not found"});
        }
        res.status(200).json(project);
    }catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({error: "Internal server error"});
    }
}
export async function getProjects(req: express.Request, res: express.Response) {
    
    try {
        const {secret} = req.params;
        if(secret !== process.env.APP_SECRET || !secret){
            return res.status(403).json({error:"Invalid secret"});
        }
        
        let projects:any = await getAllProjects();
        if(!projects || projects.length === 0){
            return res.status(404).json({error:"No projects found"});
        }
        
        return res.status(200).json({project:projects});
    }catch (error) {
        console.error("Error fetching all projects:", error);
        return res.status(500).json({error: "Internal server error"});
    }
}
export async function createNewProject(req: express.Request ,res: express.Response) {
    try {
        const file = req.file; // Multer puts the file here
        const filePath = file.path;

        if(!file) {
            console.error("No file uploaded",file);
            return res.status(400).json({error: "Image file is required"});
        }

        const result = validationResult(req);
        if(!result.isEmpty()){
            fs.unlink(filePath,(err)=>{
                if(err){
                    console.log("error deleting file")
                }
            })

            return res.status(400).json({errors: result.array()})
        }

        const {name, description, url, date, secret} = req.body;
        
        if(secret !== process.env.APP_SECRET || !secret){
            fs.unlink(filePath,(err)=>{
                if(err){
                    console.log("error deleting file");
                }
                
            })
            return res.status(403).json({error:"Invalid secret"});
        }
        if(!name){
            fs.unlink(filePath,(err)=>{
                console.log("error deleting file");
            })
            return res.status(400).json({error:"Project name is required"});
        }
        if(!description){
            fs.unlink(filePath,(err)=>{
                console.log("error deleting file");
            })
            return res.status(400).json({error:"Project description is required"});
        }
        const newProject:any = await createProject(name, description,file.filename, url , date );
        if(newProject.status == 500 ){
            return res.status(500).json(newProject)
        }else{
        res.status(201).json({message: "Project created successfully", projectId: newProject.id})};
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({error: "Internal server error"});
    }
}
