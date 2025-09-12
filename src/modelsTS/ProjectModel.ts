
import  { DataTypes,Model,Sequelize, InferAttributes,InferCreationAttributes }  from '@sequelize/core';
import { Attribute,PrimaryKey,AutoIncrement,NotNull,Table } from '@sequelize/core/decorators-legacy';



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
    console.log("Project created successfully:", newProject);
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