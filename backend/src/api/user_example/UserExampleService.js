import prisma from '../../db/db.js'

export class UserExampleService {
    
    getAllUsers = async () => {
        return await prisma.userTest.findMany()
    }

    addUser = async (user) => {
        const { username, password } = user
        await prisma.userTest.create({data: {
            username: username,
            password: password
        }})
    }

}

export const userExampleService = new UserExampleService();