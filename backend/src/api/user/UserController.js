import { userService } from "./UserService.js"
import { sendEmail } from '../../utils/email.js'
import bcrypt from 'bcrypt'

const resetTokens = {}
const verificationCodes = {}

export class UserController {
    #saltRounds = 10

    getAll = async (_req, res, next) => {
        try {
            const users = await userService.getAll();
            if (users.length === 0)
            {
                res.status(201).send(users)
            } else 
            {
                res.status(200).send(users)
            }
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const user_id = _req.params.id
            const user = await userService.getOne(user_id)
            if (user === null)
            {
                res.status(201).send(user)
            } else 
            {
                res.status(200).send(user)
            }
        }
        catch (error) {
            next(error);
        }
    }

    createOne = async (_req, res, next) => {
            try {
                const hashed_password = await bcrypt.hash(_req.body.password, this.#saltRounds)
                const payload = {
                    email: _req.body.email,
                    passwordHash: hashed_password,
                    name: _req.body.name
                }
                const serviceResponse = await userService.createOne(payload)
                res.status(200).send(serviceResponse)
            }
            catch (error) {
                if (error.code === 'P2002') {
                    return res.status(500).json({ error: 'Email already in use' })
                } else {
                    next(error)
                }
            }
        }
    
    verifyUser = async (_req, res, next) => {
        try {
            const serviceResponse = await userService.findByEmail(_req.body.email)
            if (!serviceResponse) {
                res.status(401).send({ message: 'User does not exist' })
            } else if (await bcrypt.compare(_req.body.password, serviceResponse.passwordHash)) {
                _req.session.save((err) => {
                    if (err) {
                        res.status(500).send("Error saving session")
                    }
                    _req.session.email = _req.body.email
                    _req.session.user_id = serviceResponse.id
                    _req.session.loggedIn = true
                    res.status(200).send(serviceResponse)
                })
            } else {
                res.status(401).send({ message: 'Incorrect password for user'})
            }
        }
        catch (error) {
            next(error)
        }
    }

    logout = async (_req, res, next) => {
        if (_req.session && _req.session.user_id) {
            _req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send({ message: "Could not log out "})
                }
                return res.status(200).send({
                    loggedIn: false,
                    email: undefined,
                    user_id: undefined,
                })
            })
        } else {
            res.status(201).send({ loggedIn: false })
        }
    }
    forgotPassword = async (_req, res, next) => {
        try {
            const { email } = _req.body
            const user = await userService.findByEmail(email)
            if (!user) return res.status(404).send({ message: 'User not found' })
            const token = Math.random().toString(36).substring(2, 15)
            resetTokens[token] = { email, expiry: Date.now() + 3600000 }
            const resetLink = `http://localhost:5173/reset-password?token=${token}`
            await sendEmail(email, 'Reset Your YUBuy Password', `Hi there,\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nThe YUBuy Team`)
            res.status(200).send({ message: 'Reset link sent' })
        } catch (error) { next(error) }
    }
    resetPassword = async (_req, res, next) => {
        try {
            const { token, password } = _req.body
            const data = resetTokens[token]
            if (!data) return res.status(400).send({ message: 'Invalid token' })
            if (Date.now() > data.expiry) return res.status(400).send({ message: 'Token expired' })
            await userService.updatePassword(data.email, password)
            delete resetTokens[token]
            res.status(200).send({ message: 'Password reset successful' })
        } catch (error) { next(error) }
    }

    sendVerificationCode = async (_req, res, next) => {
        try {
            const { email } = _req.body
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            verificationCodes[email] = { code, expiry: Date.now() + 600000 }
            await sendEmail(email, 'Your YUBuy Verification Code', `Hi there,\n\nYour YUBuy verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nThe YUBuy Team`)
            res.status(200).send({ message: 'Code sent' })
        } catch (error) { next(error) }
    }
     verifyCode = async (_req, res, next) => {
        try {
            const { email, code } = _req.body
            const data = verificationCodes[email]
            if (!data) return res.status(400).send({ message: 'No code found' })
            if (Date.now() > data.expiry) return res.status(400).send({ message: 'Code expired' })
            if (data.code !== code) return res.status(400).send({ message: 'Invalid code' })
            delete verificationCodes[email]
            res.status(200).send({ message: 'Code verified' })
        } catch (error) { next(error) }
    }

}

export const userController = new UserController()
