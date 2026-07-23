import { jest } from '@jest/globals'

// Mock the user service so no real Prisma/DB calls happen
jest.unstable_mockModule('../../src/api/user/UserService.js', () => ({
    userService: {
        getAll: jest.fn(),
        getOne: jest.fn(),
        createOne: jest.fn(),
        findByEmail: jest.fn(),
        updatePassword: jest.fn()
    }
}))

// Mock the email  so no real emails are sent
jest.unstable_mockModule('../../src/utils/email.js', () => ({
    sendEmail: jest.fn()
}))

// Dynamic imports required since tabove are mocked 
const { userController } = await import('../../src/api/user/UserController.js')
const { userService } = await import('../../src/api/user/UserService.js')
const { sendEmail } = await import('../../src/utils/email.js')

// Builds a fake Express response object
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
}

const next = jest.fn()

// Pulls the reset token out of the reset-password email body sent to sendEmail
const extractResetToken = () => {
    const text = sendEmail.mock.calls[0][2]
    const match = text.match(/token=([a-z0-9]+)/)
    return match[1]
}

// Pulls the 6 digit verification code out of the email body sent to sendEmail
const extractVerificationCode = () => {
    const text = sendEmail.mock.calls[0][2]
    const match = text.match(/is: (\d{6})/)
    return match[1]
}

beforeEach(() => {
    jest.clearAllMocks()
})

describe('UserController.forgotPassword', () => {
    // Test 1: Confirm forgotPassword returns 404 and does not send an email when the user does not exist
    it('returns 404 when the user does not exist', async () => {
        userService.findByEmail.mockResolvedValue(null)

        const req = { body: { email: 'notfound@test.com' } }
        const res = mockResponse()

        await userController.forgotPassword(req, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith({ message: 'User not found' })
        expect(sendEmail).not.toHaveBeenCalled()
    })

    // Test 2: Confirm forgotPassword sends a reset email and returns 200 when the user exists
    it('sends a reset email and returns 200 when the user exists', async () => {
        userService.findByEmail.mockResolvedValue({
            email: 'yubuy.noreply@gmail.com'
        })

        const req = { body: { email: 'yubuy.noreply@gmail.com' } }
        const res = mockResponse()

        await userController.forgotPassword(req, res, next)

        expect(sendEmail).toHaveBeenCalledTimes(1)
        expect(sendEmail).toHaveBeenCalledWith(
            'yubuy.noreply@gmail.com',
            'Reset Your YUBuy Password',
            expect.stringContaining('reset-password?token=')
        )
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ message: 'Reset link sent' })
    })

    // Test 3: Confirm forgotPassword forwards service errors to next() instead of crashing
    it('passes errors to next() when the service throws', async () => {
        const error = new Error('DB down')
        userService.findByEmail.mockRejectedValue(error)

        const req = { body: { email: 'yubuy.noreply@gmail.com' } }
        const res = mockResponse()

        await userController.forgotPassword(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
        expect(res.status).not.toHaveBeenCalled()
    })
})

describe('UserController.resetPassword', () => {
    // Test 4: Confirm resetPassword rejects an invalid/unknown token
    it('returns 400 for an invalid/unknown token', async () => {
        const req = { body: { token: 'not-a-real-token', password: 'newpassword1' } }
        const res = mockResponse()

        await userController.resetPassword(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token' })
        expect(userService.updatePassword).not.toHaveBeenCalled()
    })

    // Test 5: Confirm resetPassword rejects a token after the 1 hour expiry window has passed
    it('returns 400 for an expired token', async () => {
        jest.useFakeTimers()

        userService.findByEmail.mockResolvedValue({
            email: 'yubuy.noreply@gmail.com'
        })

        // Request a reset link so a real token exists
        await userController.forgotPassword(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const token = extractResetToken()

        // Fast forward past the 1 hour expiry window
        jest.advanceTimersByTime(60 * 60 * 1000 + 1000)

        const req = { body: { token, password: 'newpassword1' } }
        const res = mockResponse()

        await userController.resetPassword(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'Token expired' })

        jest.useRealTimers()
    })

    // Test 6: Confirm resetPassword updates the password and returns 200 for a valid token
    it('resets the password and returns 200 for a valid token', async () => {
        userService.findByEmail.mockResolvedValue({
            email: 'yubuy.noreply@gmail.com'
        })

        await userController.forgotPassword(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const token = extractResetToken()

        const req = { body: { token, password: 'newpassword1' } }
        const res = mockResponse()

        await userController.resetPassword(req, res, next)

        expect(userService.updatePassword).toHaveBeenCalledWith(
            'yubuy.noreply@gmail.com',
            'newpassword1'
        )
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ message: 'Password reset successful' })
    })

    // Test 7: Confirm a reset token cannot be reused after it has already been redeemed
    it('cannot reuse a token that was already redeemed', async () => {
        userService.findByEmail.mockResolvedValue({
            email: 'yubuy.noreply@gmail.com'
        })

        await userController.forgotPassword(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const token = extractResetToken()

        // First use succeeds
        await userController.resetPassword(
            { body: { token, password: 'newpassword1' } },
            mockResponse(),
            next
        )

        // Second use with the same token should fail
        const res = mockResponse()
        await userController.resetPassword(
            { body: { token, password: 'anotherpassword' } },
            res,
            next
        )

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token' })
    })
})

describe('UserController.sendVerificationCode', () => {
    // Test 8: Confirm sendVerificationCode emails a 6 digit code and returns 200
    it('emails a 6 digit code and returns 200', async () => {
        const req = { body: { email: 'yubuy.noreply@gmail.com' } }
        const res = mockResponse()

        await userController.sendVerificationCode(req, res, next)

        expect(sendEmail).toHaveBeenCalledTimes(1)
        const [to, subject, text] = sendEmail.mock.calls[0]
        expect(to).toBe('yubuy.noreply@gmail.com')
        expect(subject).toBe('Your YUBuy Verification Code')
        expect(text).toMatch(/is: \d{6}/)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ message: 'Code sent' })
    })

    // Test 9: Confirm sendVerificationCode forwards email errors to next() instead of crashing
    it('passes errors to next() when sendEmail throws', async () => {
        const error = new Error('SMTP failure')
        sendEmail.mockRejectedValue(error)

        const req = { body: { email: 'yubuy.noreply@gmail.com' } }
        const res = mockResponse()

        await userController.sendVerificationCode(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})

describe('UserController.verifyCode', () => {
    // Test 10: Confirm verifyCode returns 400 when no code was ever requested for that email
    it('returns 400 when no code was requested for the email', async () => {
        const req = { body: { email: 'never-sent@test.com', code: '123456' } }
        const res = mockResponse()

        await userController.verifyCode(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'No code found' })
    })

    // Test 11: Confirm verifyCode rejects a code after the 10 minute expiry window has passed
    it('returns 400 for an expired code', async () => {
        jest.useFakeTimers()

        await userController.sendVerificationCode(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const code = extractVerificationCode()

        // Fast forward past the 10 minute expiry window
        jest.advanceTimersByTime(10 * 60 * 1000 + 1000)

        const req = { body: { email: 'yubuy.noreply@gmail.com', code } }
        const res = mockResponse()

        await userController.verifyCode(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'Code expired' })

        jest.useRealTimers()
    })

    // Test 12: Confirm verifyCode rejects an incorrect 6 digit code
    it('returns 400 for an incorrect code', async () => {
        await userController.sendVerificationCode(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )

        const req = { body: { email: 'yubuy.noreply@gmail.com', code: '000000' } }
        const res = mockResponse()

        await userController.verifyCode(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid code' })
    })

    // Test 13: Confirm verifyCode accepts the correct 6 digit code and returns 200
    it('returns 200 for the correct code', async () => {
        await userController.sendVerificationCode(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const code = extractVerificationCode()

        const req = { body: { email: 'yubuy.noreply@gmail.com', code } }
        const res = mockResponse()

        await userController.verifyCode(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ message: 'Code verified' })
    })

    // Test 14: Confirm a verification code cannot be reused after it has already been verified
    it('cannot reuse a code that was already verified', async () => {
        await userController.sendVerificationCode(
            { body: { email: 'yubuy.noreply@gmail.com' } },
            mockResponse(),
            next
        )
        const code = extractVerificationCode()

        // First verification succeeds
        await userController.verifyCode(
            { body: { email: 'yubuy.noreply@gmail.com', code } },
            mockResponse(),
            next
        )

        // Second attempt with the same code should fail
        const res = mockResponse()
        await userController.verifyCode(
            { body: { email: 'yubuy.noreply@gmail.com', code } },
            res,
            next
        )

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({ message: 'No code found' })
    })
})