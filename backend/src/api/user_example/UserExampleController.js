import { userExampleService } from "./UserExampleService.js";

export class UserExampleController {
    getUsers = async (_req, res, next) => {
        try {
            const users = await userExampleService.getAllUsers();
            res.status(200).send(users)
        }
        catch (error) { 
            next(error);
        }
    }
}

export const userExampleController = new UserExampleController()