// @vitest-environment jsdom
import {
    render,
    screen,
    cleanup
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    MemoryRouter,
    Routes,
    Route
} from 'react-router-dom'
import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from 'vitest'
import axios from 'axios'
import Login from '../pages/Login'

// Mock Axios so the tests don't send real requests to the Express Backend
vi.mock('axios', () => ({
    default: {
        post: vi.fn()
    }
}))

// Render Login component inside temp router to verify
// Register and Listings route navigation
const renderLogin = () => {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<h1>Register Page</h1>}
                />

                <Route
                    path="/listings"
                    element={<h1>Listings Page</h1>}
                />
            </Routes>
        </MemoryRouter>
    )
}

// Enter valid login credentials used by successful login tests
const enterValidLoginDetails = async (user) => {
    await user.type(
        screen.getByPlaceholderText(/email/i),
        'yubuy.noreply@gmail.com'
    )

    await user.type(
        screen.getByPlaceholderText(/password/i),
        '12345678'
    )
}

// Log in successfully and open the verification popup
const openVerificationPopup = async (user) => {
    // First mocked response is for login
    // Second mocked response is for sending the code
    axios.post
        .mockResolvedValueOnce({
            data: {
                message: 'Login successful'
            }
        })
        .mockResolvedValueOnce({
            data: {
                message: 'Code sent'
            }
        })

    renderLogin()

    await enterValidLoginDetails(user)

    await user.click(
        screen.getByRole('button', {
            name: /sign in/i
        })
    )

    expect(
        await screen.findByRole('heading', {
            name: /check your email!/i
        })
    ).toBeInTheDocument()
}

// Clear rendered components and Axios mock calls
// and responses after each test
afterEach(() => {
    cleanup()
    vi.resetAllMocks()
})

describe('Login Page', () => {
    // Test 1: Confirm main Login page content appears
    it('renders the login form', () => {
        renderLogin()

        expect(
            screen.getByRole('heading', {
                name: /welcome back/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/email/i)
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/password/i)
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', {
                name: /sign in/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText(/forgot password\?/i)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/create one now!/i)
        ).toBeInTheDocument()
    })

    // Test 2: Confirm that submitting form with empty fields
    // displays "required fields" validation message
    it('shows an error when the fields are empty', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        expect(
            await screen.findByText(
                /all fields are required/i
            )
        ).toBeInTheDocument()

        // Stop validation before contacting backend
        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 3: Confirm invalid email address is rejected
    it('shows an error when the email is invalid', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.type(
            screen.getByPlaceholderText(/email/i),
            'notanemail'
        )

        await user.type(
            screen.getByPlaceholderText(/password/i),
            '12345678'
        )

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        expect(
            await screen.findByText(
                /please enter a valid email address/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 4: Confirm that if a password is shorter
    // than 8 characters it is rejected
    it('shows an error when the password is too short', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.type(
            screen.getByPlaceholderText(/email/i),
            'test@test.com'
        )

        await user.type(
            screen.getByPlaceholderText(/password/i),
            '123'
        )

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        expect(
            await screen.findByText(
                /password must be at least 8 characters/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 5: Confirm that clicking the Forgot Password
    // text opens forgot password popup
    it('opens the forgot password popup', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.click(
            screen.getByText(/forgot password\?/i)
        )

        expect(
            screen.getByRole('heading', {
                name: /forgot password\?/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                /enter your email and we'll send you a reset link/i
            )
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', {
                name: /send reset link/i
            })
        ).toBeInTheDocument()
    })

    // Test 6: Confirm that forgot password popup
    // requires user to enter an email
    it('shows an error when the reset email is empty', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.click(
            screen.getByText(/forgot password\?/i)
        )

        await user.click(
            screen.getByRole('button', {
                name: /send reset link/i
            })
        )

        expect(
            await screen.findByText(
                /please enter your email/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 7: Confirm that the forgot password popup
    // rejects invalid email addresses
    it('shows an error when reset email is invalid', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.click(
            screen.getByText(/forgot password\?/i)
        )

        /*
         * Since there are 2 placeholders named "Email":
         * emailInputs[0] = forgot password popup email
         * emailInputs[1] = login form email
         */
        const emailInputs =
            screen.getAllByPlaceholderText(/email/i)

        const resetEmailInput = emailInputs[0]

        await user.type(
            resetEmailInput,
            'invalidemail'
        )

        await user.click(
            screen.getByRole('button', {
                name: /send reset link/i
            })
        )

        expect(
            await screen.findByText(
                /please enter a valid email address/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 8: Confirm that a valid forgot password
    // request is sent to the backend endpoint
    it('sends a password reset request for a valid email', async () => {
        const user = userEvent.setup()

        // Mocked Axios request
        axios.post.mockResolvedValueOnce({
            data: {
                message: 'Reset link sent'
            }
        })

        renderLogin()

        await user.click(
            screen.getByText(/forgot password\?/i)
        )

        const emailInputs =
            screen.getAllByPlaceholderText(/email/i)

        const resetEmailInput = emailInputs[0]

        await user.type(
            resetEmailInput,
            'yubuy.noreply@gmail.com'
        )

        await user.click(
            screen.getByRole('button', {
                name: /send reset link/i
            })
        )

        // Confirm correct endpoint and request body passed to Axios
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/user/forgot-password',
            {
                email: 'yubuy.noreply@gmail.com'
            }
        )

        // After success, popup should have confirmation message
        expect(
            await screen.findByRole('heading', {
                name: /check your email!/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                /we sent a reset link to/i
            )
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'yubuy.noreply@gmail.com'
            )
        ).toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(1)
    })

    /*
     * Test 9: Confirm that the correct error appears when
     * the forgot password backend fails due to email not existing
     */
    it('shows an error when reset email is not found', async () => {
        const user = userEvent.setup()

        // Simulate backend rejecting email
        axios.post.mockRejectedValueOnce(
            new Error('Email not found')
        )

        renderLogin()

        await user.click(
            screen.getByText(/forgot password\?/i)
        )

        const emailInputs =
            screen.getAllByPlaceholderText(/email/i)

        const resetEmailInput = emailInputs[0]

        await user.type(
            resetEmailInput,
            'notfound@test.com'
        )

        await user.click(
            screen.getByRole('button', {
                name: /send reset link/i
            })
        )

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/user/forgot-password',
            {
                email: 'notfound@test.com'
            }
        )

        expect(
            await screen.findByText(
                /email not found\. please try again\./i
            )
        ).toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(1)
    })

    // Test 10: Confirm that the Create one now link
    // navigates to register page
    it('navigates to the register page', async () => {
        const user = userEvent.setup()

        renderLogin()

        await user.click(
            screen.getByText(/create one now!/i)
        )

        expect(
            screen.getByText(/register page/i)
        ).toBeInTheDocument()
    })

    // Test 11: Confirm that successful login
    // opens verification popup
    it('successfully logs in and opens the verification popup', async () => {
        const user = userEvent.setup()

        // Check for successful login
        axios.post
            .mockResolvedValueOnce({
                data: {
                    message: 'Login successful'
                }
            })
            // Send verification code
            .mockResolvedValueOnce({
                data: {
                    message: 'Code sent'
                }
            })

        renderLogin()

        await enterValidLoginDetails(user)

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        expect(axios.post).toHaveBeenNthCalledWith(
            1,
            'http://localhost:8080/api/user/login',
            {
                email: 'yubuy.noreply@gmail.com',
                password: '12345678'
            }
        )

        expect(axios.post).toHaveBeenNthCalledWith(
            2,
            'http://localhost:8080/api/user/send-code',
            {
                email: 'yubuy.noreply@gmail.com'
            }
        )

        expect(
            await screen.findByRole('heading', {
                name: /check your email!/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                /yubuy\.noreply@gmail\.com/i
            )
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText('000000')
        ).toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(2)
    })

    // Test 12: Confirms that a rejected login
    // shows an error and NOT the verification popup
    it('shows an error when login fails', async () => {
        const user = userEvent.setup()

        // Simulate backend rejecting the account that does not work
        axios.post.mockRejectedValueOnce(
            new Error('Invalid login')
        )

        renderLogin()

        // Enter the login details that should be rejected
        await user.type(
            screen.getByPlaceholderText(/email/i),
            'yubuy@test.com'
        )

        await user.type(
            screen.getByPlaceholderText(/password/i),
            '12345678'
        )

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/user/login',
            {
                email: 'yubuy@test.com',
                password: '12345678'
            }
        )

        expect(
            await screen.findByText(
                /invalid email or password/i
            )
        ).toBeInTheDocument()

        // Popup should NOT appear
        expect(
            screen.queryByPlaceholderText('000000')
        ).not.toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(1)
    })

    // Test 13: Confirm that a verification
    // code shorter than 6 digits is rejected
    it('shows an error when verification code is too short', async () => {
        const user = userEvent.setup()

        await openVerificationPopup(user)

        await user.type(
            screen.getByPlaceholderText('000000'),
            '123'
        )

        await user.click(
            screen.getByRole('button', {
                name: /^verify$/i
            })
        )

        expect(
            screen.getByText(
                /please enter the 6 digit code/i
            )
        ).toBeInTheDocument()

        // Only login and send-code should have been called
        expect(axios.post).toHaveBeenCalledTimes(2)
    })

    // Test 14: Confirm that a valid code calls the verification
    // endpoint and navigates to listings page
    it('successfully verifies the code and navigates to listings page', async () => {
        const user = userEvent.setup()

        // Mock successful login, code delivery and code verification
        axios.post
            .mockResolvedValueOnce({
                data: {
                    message: 'Login successful'
                }
            })
            .mockResolvedValueOnce({
                data: {
                    message: 'Code sent'
                }
            })
            .mockResolvedValueOnce({
                data: {
                    message: 'Code verified'
                }
            })

        renderLogin()

        await enterValidLoginDetails(user)

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        const codeInput =
            await screen.findByPlaceholderText('000000')

        // The backend request is mocked, so this test code
        // does not need to match a real generated email code
        await user.type(codeInput, '123456')

        await user.click(
            screen.getByRole('button', {
                name: /^verify$/i
            })
        )

        expect(axios.post).toHaveBeenNthCalledWith(
            3,
            'http://localhost:8080/api/user/verify-code',
            {
                email: 'yubuy.noreply@gmail.com',
                code: '123456'
            }
        )

        expect(
            await screen.findByText(
                /listings page/i
            )
        ).toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(3)
    })

    // Test 15: Confirm that a rejected verification
    // request shows an error on the verification popup
    it('shows an error when verification fails', async () => {
        const user = userEvent.setup()

        // Login and send code work,
        // but the verification code is wrong
        axios.post
            .mockResolvedValueOnce({
                data: {
                    message: 'Login successful'
                }
            })
            .mockResolvedValueOnce({
                data: {
                    message: 'Code sent'
                }
            })
            .mockRejectedValueOnce(
                new Error('Invalid verification code')
            )

        renderLogin()

        await enterValidLoginDetails(user)

        await user.click(
            screen.getByRole('button', {
                name: /sign in/i
            })
        )

        const codeInput =
            await screen.findByPlaceholderText('000000')

        await user.type(
            codeInput,
            '654321'
        )

        await user.click(
            screen.getByRole('button', {
                name: /^verify$/i
            })
        )

        expect(axios.post).toHaveBeenNthCalledWith(
            3,
            'http://localhost:8080/api/user/verify-code',
            {
                email: 'yubuy.noreply@gmail.com',
                code: '654321'
            }
        )

        expect(
            await screen.findByText(
                /invalid or expired code\. please try again\./i
            )
        ).toBeInTheDocument()

        // Verification popup should remain open
        expect(
            screen.getByPlaceholderText('000000')
        ).toBeInTheDocument()

        // User should not navigate to Listings
        expect(
            screen.queryByText(/listings page/i)
        ).not.toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(3)
    })
})
