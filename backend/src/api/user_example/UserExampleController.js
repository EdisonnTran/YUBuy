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

    addUser = async (_req, res, next) => {
        try {
            const payload = {
                username: _req.body.username,
                password: _req.body.password,
            }

            const serviceResponse = await userExampleService.addUser(payload)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error);
        }
    }
}

export const userExampleController = new UserExampleController()