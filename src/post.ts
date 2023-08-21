import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient()
const app = express()

exports = module.exports = function (app:any){
    app.post('/admin/post',async (req: Request, res: Response) => {
        let { title, content, authorId } = req.body;
        try{
            const post = await prisma.post.create({
                data: {
                    title: title,
                    content: content,
                    published: true,
                    authorId: authorId
                }
            })

            res.status(200).json(post)
        }catch(error){
        res.status(201).json(error)
        }
    })

    app.post('/admin/user',async (req:Request, res:Response) => {
        try{
            let { email, name, psswd } = req.body
            const user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: psswd
                }
            })
            res.status(200).json(user)
        }catch(e){
            res.status(201).json(e)
        }
    })

    app.post('/admin/projects',async (req:Request, res:Response) => {
        try{
            let { title, imgUrl, link, repo } = req.body;
            const project = prisma.projects.create({
                data: {
                    title: title,
                    imgUrl: imgUrl,
                    link: link,
                    repository: repo
                }
            })
            res.status(200).json(project)
        }catch(e){
            res.status(201).json(e)
        }
    })

    app.post('/admin/timeline',async (req:any, res:any) => {
        try{
            let { title, year, duration, details } = req.body;
            const timeline = prisma.timeline.create({
                data: {
                    title: title,
                    year: year,
                    duration: duration,
                    details: details
                }
            })
            res.status(200).json(timeline)
        }catch(e){
            res.status(201).json(e)
        }
    })
}