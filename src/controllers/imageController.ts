import * as fs from "fs"
import  Express  from "express"
import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3"
import { Readable } from "stream";

export async function getImage(req: Express.Request,res:Express.Response){
    try{
        const client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId : process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
            }
        })
        if(!req.params.filename){
            return res.status(400).send("Filename is required");
        }
        const filename = req.params.filename;
        const imagePath = process.env.IMAGE_PATH+"/"+filename




        res.sendFile(imagePath, async (err)=>{
            if(err){
                console.log("error sending image checking bucket",err);
                try {
                    const data = await client.send(
                        new GetObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: filename
                        }))

                    const writeStream = fs.createWriteStream(process.env.IMAGE_PATH+"/"+filename);   
                    const body = data.Body
                    if(body instanceof Readable){
                       body.pipe(writeStream)
                       
                       await new Promise<void>((resolve,reject)=>{
                        writeStream.on("error",reject);
                        writeStream.on("finish",()=>{
                            res.sendFile(imagePath)
                            resolve();
                        })
                       })
                    }
                
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }catch(error){
        res.status(500).send("Server error");
    }

}