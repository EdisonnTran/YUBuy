import prisma from '../../db/db.js'

export class UserService {
    
    getAll = async () => {
        return await prisma.user.findMany()
    }

    getOne = async (user_id) => {
        return await prisma.user.findUnique({
            where: {id: user_id},
        })
    }

    createOne = async (payload) => {
        await prisma.user.create({data: {
            email: payload.name,
            passwordHash: payload.passwordHash,
            name: payload.name
        }})
    }

    verifyOne = async (payload) => {
        return await prisma.user.findUnique({
            where: {
                email: payload.email,
                passwordHash: payload.passwordHash
            }
        })
    }

}

export const userService = new UserService();