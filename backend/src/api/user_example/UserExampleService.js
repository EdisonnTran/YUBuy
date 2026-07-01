import { prisma } from '../../db/db.js'

export class UserExampleService {
    
    getAllUsers = async () => {
        return await prisma.userTest.findMany()
    }

}

export const userExampleService = new UserExampleService();