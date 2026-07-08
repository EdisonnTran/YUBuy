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
            email: payload.email,
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
     findByEmail = async (email) => {
        return await prisma.user.findUnique({ where: { email } })
    }

    updatePassword = async (email, password) => {
        await prisma.user.update({ where: { email }, data: { passwordHash: password } })
    }

}

export const userService = new UserService();