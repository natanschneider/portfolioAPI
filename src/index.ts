import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';

const prisma = new PrismaClient()
const app = express()


const middleware = async (req:Request, res:Response, next:NextFunction) => {
    try{
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS")
        const excludedRoute = '/feed';
        if (req.path == excludedRoute){
            return next();
        }
        
        const tokenEnv = process.env.API_TOKEN

        if(req.body.token != tokenEnv){
            console.log(req.body.token)
            res.status(201).json('invalid token')
            return;
        }
        let { email, psswd } = req.body;

        const validUser = await prisma.user.findUnique({
            where: {
                email: email,
                password: psswd
            }
        })
        

        if(validUser?.email && validUser?.password){
            next();
        }else{
            res.status(201).json('Não foi possivel fazer login')
        }
    }catch(e){
        res.status(201).json('Não foi possivel fazer login')
    }
};

app.use(cors())
app.use(express.json())
app.use(middleware)
require('./get')(app)
require('./post')(app)

app.listen(5000, () =>
    console.log('SERVIDOR ESTA RODANDO'),
)