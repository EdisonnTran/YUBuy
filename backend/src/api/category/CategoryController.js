import { categoryService } from "./CategoryService.js";

export class CategoryController {
    getAll = async (_req, res, next) => {
        try {
            const categories = await categoryService.getAll();
            res.status(200).send(categories)
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const category_id = _req.params.id

            const category = await categoryService.getOne(category_id)
            res.status(200).send(category)
        }
        catch (error) {
            next(error);
        }
    }

    createOne = async (_req, res, next) => {
            try {
                const category_name = _req.body.name
                const serviceResponse = await categoryService.createOne(category_name)
                res.status(200).send(serviceResponse)
            }
            catch (error) {
                next(error);
            }
        }
}

export const categoryController = new CategoryController()