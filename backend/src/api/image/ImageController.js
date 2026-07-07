import { imageService } from "./ImageService.js";

export class ImageController {
    getAll = async (_req, res, next) => {
        try {
            const images = await imageService.getAll();
            res.status(200).send(images)
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const image_id = _req.params.id

            const image = await imageService.getOne(image_id)
            res.status(200).send(image)
        }
        catch (error) {
            next(error);
        }
    }

    createOne = async (_req, res, next) => {
            try {
                const image_url = _req.body.image_url
                const serviceResponse = await imageService.createOne(image_url)
                res.status(200).send(serviceResponse)
            }
            catch (error) {
                next(error);
            }
        }
}

export const imageController = new ImageController()