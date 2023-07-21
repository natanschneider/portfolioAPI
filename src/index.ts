import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient()
const app = express()

const middleware = async (req:any, res:any, next:any) => {
    const excludedRoute = '/feed/:token';
    if (req.path == excludedRoute){
        return next();
    }
    
    const tokenEnv = process.env.API_TOKEN

    if(req.body.token != tokenEnv){
        res.status(201).json('invalid token')
    }
    let { email, psswd } = req.body;

    const validUser = await prisma.user.findUnique({
        where: {
            email: email,
            password: psswd
        }
    })
    

    if(validUser?.email){
        next();
    }
};

app.use(express.json())
app.use(middleware)

app.get('/', (req, res) => {
    res.json('Hi there')
})

app.get('/login/:token',async (req:any, res:any) => {
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

app.get('/post/:token',async (req:any, res:any) => {
        const feed = await prisma.post.findMany()
        res.status(200).json(feed)
})

app.post('/post/:token',async (req: any, res: any) => {
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

app.post('/user/:token',async (req:any, res:any) => {
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

app.post('/projects/:token',async (req:any, res:any) => {
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

app.post('/timeline/:token',async (req:any, res:any) => {
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

app.listen(3000, () =>
    console.log('SERVIDOR ESTA RODANDO'),
)