
import  { DataTypes,Model,Sequelize, InferAttributes,InferCreationAttributes }  from '@sequelize/core';
import { Attribute,PrimaryKey,AutoIncrement,NotNull,Table } from '@sequelize/core/decorators-legacy';
import * as fs from "fs";
import { S3Client, DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';


@Table({ tableName: 'projects' }) // Specify the table name if different
export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare img_url: string;

    @Attribute(DataTypes.STRING)
    declare project_url: string | null;

    @Attribute(DataTypes.STRING)
    declare date: string | null;
    // Additional methods can be added here for project-related operations
}

export async function createProject(name: string, description: string, img_url: string, project_url: string | null, date: string | null) {
    try {const newProject = await Project.build({ name, description, img_url, project_url, date });
    await newProject.save();
    return newProject
    }catch(error){
        console.log("database error:", error)
        return ( {status: 500,error:error})
    }
}

export async function getProjectById(id: number) {
    try{
    const project = await Project.findOne({ where: { id } });
    
    return project;
    }catch(error){
        console.log("database error:", error)
        return ( {status: 500,error:error})
    }
}

export async function getAllProjects() {
    try{
    const projects = await Project.findAll();
    //console.log("All projects found:", projects);
    return projects;
}catch(error){
    console.log("database error:", error)
    return ( {status: 500,error:error})
}
}
export async function deleteProjectByName(name: string){
    try{
        let project = await Project.findOne({where:{name:name}})
        let imagePath = process.env.IMAGE_PATH+"/"+project.img_url;
        const client = new S3Client({
            region:process.env.AWS_REGION,
            credentials:{
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        })
        try{
            client.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: project.img_url
            }))
        }catch(error){
            console.log("error deleting picture from bucket")
        }

        fs.unlink(imagePath,(err)=>{
            if(err){
                console.log("error deleting file:",err)
                return {status:500, errro:err}
            }
            else{
                console.log("image file deleted successfully")}
        })
        const res = await Project.destroy({where:{name:name}});
        return res;
    }catch(error){
        console.log("database error:",error)
        return({status:500,error:error})
    }
}