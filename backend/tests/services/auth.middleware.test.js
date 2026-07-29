import { jest } from '@jest/globals'
import { requireAuth, requireRole } from '../../src/middleware/auth.js'

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

describe('Auth middleware', () => {
  let res, next
  beforeEach(() => {
    res = mockRes()
    next = jest.fn()
  })

  describe('requireAuth', () => {
    test('calls next when the user is logged in', () => {
      requireAuth({ session: { loggedIn: true, user_id: 'user-1' } }, res, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })
    test('responds 401 when there is no session', () => {
      requireAuth({}, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
    test('responds 401 when the session is not logged in', () => {
      requireAuth({ session: { loggedIn: false } }, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe("requireRole('ADMIN')", () => {
    test('calls next for a logged-in admin', () => {
      requireRole('ADMIN')({ session: { loggedIn: true, user_id: 'admin-1', role: 'ADMIN' } }, res, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })
    test('responds 403 for a logged-in non-admin user', () => {
      requireRole('ADMIN')({ session: { loggedIn: true, user_id: 'user-1', role: 'USER' } }, res, next)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(next).not.toHaveBeenCalled()
    })
    test('responds 401 when nobody is logged in', () => {
      requireRole('ADMIN')({}, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
