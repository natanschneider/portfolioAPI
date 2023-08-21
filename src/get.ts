import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

exports = module.exports = function(app:any){
    app.get('/', (req:Request, res:Response) => {
        res.json('Hi there')
    })

    app.get('/login',async (req:Request, res:Response) => {
            let { email, psswd } = req.body
            try{
                const user = await prisma.user.findUnique({
                    where: {
                        email: String(email),
                        password: String(psswd),
                    },
                })

                res.status(200).json(user)
            }catch(e){
                res.status(201).json('Error: '+e)
            }
    })

    app.get('/feed',async (req:Request, res:Response) => {
            const feed = await prisma.post.findMany()
            res.status(200).json(feed)
    })
}