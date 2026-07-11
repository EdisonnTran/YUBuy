import prisma from '../../db/db.js'

export class CategoryService {
    
    getAll = async () => {
        return await prisma.category.findMany()
    }

    getOne = async (category_id) => {
        return await prisma.category.findUnique({
            where: {id: category_id}
        })
    }

    createOne = async (category_name) => {
        await prisma.category.create({data: {
            name: category_name
        }})
    }

}

export const categoryService = new CategoryService();