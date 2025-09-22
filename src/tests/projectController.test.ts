import { afterAll,beforeAll,describe,expect,test } from "@jest/globals";
import request  from "supertest";
import { app,CloseDatabase,server } from "../app.ts";
import fs from "fs";

//tests to pass
describe("Project Controller create file test",()=>{


    const file = "src/tests/test-image.png";
    beforeAll(async()=>{
        fs.writeFileSync(file,"this is a test image file");
    })
    //cleanup
    afterAll(()=>{
        fs.unlinkSync(file)
    })

    test("create project function should return a 201 status code", async()=>{
    
    

    let project  = {name: "testproject",description:"this is a test project",url:"",date:"",secret:process.env.APP_SECRET};
    let response = await request(app).post("/projects/add").field(project).attach("image",file);
    expect(response.statusCode).toBe(201);

    })


})

test("get all projects function should return a 200 status code", async()=>{
    let response = await request(app).get("/projects/"+process.env.APP_SECRET);
    expect(response.statusCode).toBe(200);
})
test("delete project function should return a 200 status code", async()=>{
    let response = await request(app).delete("/projects/delete/testproject/"+process.env.APP_SECRET);
    expect(response.statusCode).toBe(200);
})
//tests to fail

//cleanup

afterAll(async () =>{
    await CloseDatabase()
    server.close()
    console.log("finished project controller tests")
})