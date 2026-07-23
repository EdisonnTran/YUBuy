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
import '@testing-library/jest-dom/vitest'
import axios from 'axios'
import Register from '../pages/Register'

// Mock Axios so the tests do not send real requests to the Express backend
vi.mock('axios', () => ({
    default: {
        post: vi.fn()
    }
}))

// Render the Register component inside a temporary router so navigation to Login and Listings can be verified
const renderRegister = () => {
    return render(
        <MemoryRouter initialEntries={['/register']}>
            <Routes>
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<h1>Login Page</h1>}
                />

                <Route
                    path="/listings"
                    element={<h1>Listings Page</h1>}
                />
            </Routes>
        </MemoryRouter>
    )
}

// Enter valid registration details used by successful tests
const enterValidRegistrationDetails = async (user) => {
    await user.type(
        screen.getByPlaceholderText(/name/i),
        'John Doe'
    )

    await user.type(
        screen.getByPlaceholderText(/email/i),
        'john@test.com'
    )

    await user.type(
        screen.getByPlaceholderText(/password/i),
        '12345678'
    )
}

// Clear rendered components and Axios mock calls
afterEach(() => {
    cleanup()
    vi.resetAllMocks()
})

describe('Registration Page', () => {
    // Test 1: Confirm the main Registration page content appears
    it('renders the registration form', () => {
        renderRegister()

        expect(
            screen.getByRole('heading', {
                name: /create your account/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/name/i)
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/email/i)
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/password/i)
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', {
                name: /register/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText(/sign in/i)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/must be 8 characters at least/i)
        ).toBeInTheDocument()
    })

    // Test 2: Confirm submitting with empty fields displays the required-fields validation message
    it('shows an error when the fields are empty', async () => {
        const user = userEvent.setup()
        renderRegister()

        await user.click(
            screen.getByRole('button', {
                name: /register/i
            })
        )

        expect(
            await screen.findByText(
                /all fields are required/i
            )
        ).toBeInTheDocument()

        // Validation should stop before contacting the backend
        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 3: Confirm an invalid email address is rejected
    it('shows an error when the email is invalid', async () => {
        const user = userEvent.setup()
        renderRegister()

        await user.type(
            screen.getByPlaceholderText(/name/i),
            'John Smith'
        )

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
                name: /register/i
            })
        )

        expect(
            await screen.findByText(
                /please enter a valid email address/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 4: Confirm a password shorter than 8 characters is rejected
    it('shows an error when the password is too short', async () => {
        const user = userEvent.setup()
        renderRegister()

        await user.type(
            screen.getByPlaceholderText(/name/i),
            'John Smith'
        )

        await user.type(
            screen.getByPlaceholderText(/email/i),
            'john@test.com'
        )

        await user.type(
            screen.getByPlaceholderText(/password/i),
            '123'
        )

        await user.click(
            screen.getByRole('button', {
                name: /register/i
            })
        )

        expect(
            await screen.findByText(
                /password must be at least 8 characters/i
            )
        ).toBeInTheDocument()

        expect(axios.post).not.toHaveBeenCalled()
    })

    // Test 5: Confirm successful registration sends the correct request and navigates to Listings
    it('successfully registers and navigates to listings page', async () => {
        const user = userEvent.setup()

        axios.post.mockResolvedValueOnce({
            data: {
                message: 'Registration successful'
            }
        })

        renderRegister()

        await enterValidRegistrationDetails(user)

        await user.click(
            screen.getByRole('button', {
                name: /register/i
            })
        )

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/user',
            {
                name: 'John Doe',
                email: 'john@test.com',
                password: '12345678'
            }
        )

        expect(
            await screen.findByText(/listings page/i)
        ).toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(1)
    })

    // Test 6: Confirm a rejected registration request displays the registration failure message
    it('shows an error when registration fails', async () => {
        const user = userEvent.setup()

        axios.post.mockRejectedValueOnce(
            new Error('Registration failed')
        )

        renderRegister()

        await enterValidRegistrationDetails(user)

        await user.click(
            screen.getByRole('button', {
                name: /register/i
            })
        )

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/user',
            {
                name: 'John Doe',
                email: 'john@test.com',
                password: '12345678'
            }
        )

        expect(
            await screen.findByText(
                /registration failed\. please try again\./i
            )
        ).toBeInTheDocument()

        expect(
            screen.queryByText(/listings page/i)
        ).not.toBeInTheDocument()

        expect(axios.post).toHaveBeenCalledTimes(1)
    })

    // Test 7: Confirm clicking Sign in navigates back to the Login page
    it('navigates to the login page', async () => {
        const user = userEvent.setup()
        renderRegister()

        await user.click(
            screen.getByText(/^sign in$/i)
        )

        expect(
            screen.getByText(/login page/i)
        ).toBeInTheDocument()
    })

    // Test 8: Confirm clicking the eye icon changes the password input to visible text
    it('shows the password when the eye icon is clicked', async () => {
        const user = userEvent.setup()
        renderRegister()

        const passwordInput =
            screen.getByPlaceholderText(/password/i)

        expect(passwordInput).toHaveAttribute(
            'type',
            'password'
        )

        const passwordContainer =
            passwordInput.parentElement

        const icons =
            passwordContainer.querySelectorAll('svg')

        const eyeIcon = icons[icons.length - 1]

        await user.click(eyeIcon)

        expect(passwordInput).toHaveAttribute(
            'type',
            'text'
        )
    })

    // Test 9: Confirm clicking the eye-slash icon hides the password again
    it('hides the password when the eye-slash icon is clicked', async () => {
        const user = userEvent.setup()
        renderRegister()

        const passwordInput =
            screen.getByPlaceholderText(/password/i)

        const passwordContainer =
            passwordInput.parentElement

        let icons =
            passwordContainer.querySelectorAll('svg')

        await user.click(
            icons[icons.length - 1]
        )

        expect(passwordInput).toHaveAttribute(
            'type',
            'text'
        )

        icons =
            passwordContainer.querySelectorAll('svg')

        await user.click(
            icons[icons.length - 1]
        )

        expect(passwordInput).toHaveAttribute(
            'type',
            'password'
        )
    })

    // Test 10: Confirm the normal password guidance is replaced by an error after failed validation
    it('replaces the password guidance with a validation error', async () => {
        const user = userEvent.setup()
        renderRegister()

        expect(
            screen.getByText(/must be 8 characters at least/i)
        ).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', {
                name: /register/i
            })
        )

        expect(
            await screen.findByText(
                /all fields are required/i
            )
        ).toBeInTheDocument()

        expect(
            screen.queryByText(/must be 8 characters at least/i)
        ).not.toBeInTheDocument()
    })
})