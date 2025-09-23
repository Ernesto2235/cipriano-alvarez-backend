import * as fs from "fs"
import  Express  from "express"


export async function getImage(req: Express.Request,res:Express.Response){
    try{
        if(!req.params.filename){
            return res.status(400).send("Filename is required");
        }
        const filename = req.params.filename;
        const imagePath = process.env.IMAGE_PATH+"/"+filename

        res.sendFile(imagePath,(err)=>{
            if(err){
                console.log("error sending image",err);
                res.status(404).send("image not found");
            }
        })
    }catch(error){
        res.status(500).send("Server error");
    }

}