import * as fs from "fs"
import  Express  from "express"


export async function getImage(req: Express.Request,res:Express.Response){
    const filename = req.params.filename;
    const imagePath = "./images/"+filename
    // fs.readFile(imagePath,(error,data)=>{
    //     if(error){
    //         console.log("error getting picture",error)
    //         return res.status(404).send("Image not found");
    //     }
    //     let fileExt = filename.split(".").pop();
    //     res.writeHead(200,{"Content-Type":"image/"+fileExt})
    //     res.end(data);
    // })

    res.sendFile(imagePath,(err)=>{
        if(err){
            console.log("error sending image",err);
            res.status.apply(404).send("image not found");
        }
    })

}