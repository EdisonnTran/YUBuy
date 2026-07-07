import { userService } from "./UserService.js";

export class UserController {
    getAll = async (_req, res, next) => {
        try {
            const users = await userService.getAll();
            res.status(200).send(users)
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const user_id = _req.params.id

            const user = await userService.getOne(user_id)
            res.status(200).send(user)
        }
        catch (error) {
            next(error);
        }
    }

    createOne = async (_req, res, next) => {
            try {
                const payload = {
                    email: _req.body.email,
                    passwordHash: _req.body.password, // Password to be encrypted using bcrypt
                    name: _req.body.name
                }
                const serviceResponse = await userService.createOne(payload)
                res.status(200).send(serviceResponse)
            }
            catch (error) {
                next(error)
            }
        }
    
    verifyUser = async (_req, res, next) => {
        const payload = {
            email: _req.body.email,
            passwordHash: _req.body.password
        }
        try {
            const serviceResponse = await userService.verifyOne(payload)
            if (serviceResponse) return true
            // if (serviceResponse) {
            //     _req.session.save(() => {
            //         _req.session.email = serviceResponse.responseObject.email
            //         _req.session.user_id = serviceResponse.responseObject.id
            //         res.status(200).send(servceResponse)
            //         console.log("login successful!")
            //     })
            // }
        }
        catch (error) {
            next(error)
        }
    }

    logout = async (_req, res, next) => {
        if (_req.session.user_id) {
            _req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send({ message: "Could not log out "})
                }
                return res.send({
                    loggedIn: false,
                    email: undefined,
                    id: undefined,
                })
            })
        } else {
            res.send({ loggedIn: false })
        }
    }
}

export const userController = new UserController()