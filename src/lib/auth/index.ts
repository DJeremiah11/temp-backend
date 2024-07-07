import { Request } from "express"

export const verifyToken = (token:string) => {
    return token
}

export const hashPassword = async(password:string) => {
    return password
}

export const comparePassword = (password:string, hashedPassword:string): Boolean => {
    return password === hashedPassword
}

export const generateToken = (id:string) => {
    return id
}

export const generateUserIdFromToken = (req: Request) => {
    return req.cookies
}