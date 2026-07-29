// Authentication and role-based access control middleware.
// The design document (UC2, UC4) requires that protected routes only run for
// authenticated users, and that admin-only actions reject anyone without the
// ADMIN role before any database operation is attempted.

// requireAuth: allows the request through only if a user is logged in.
export function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn && req.session.user_id) {
    return next()
  }
  return res.status(401).send({ error: 'Authentication required' })
}

// requireRole('ADMIN', ...): allows the request through only if the logged-in
// user's role is one of the allowed roles. Returns 401 if not logged in, 403
// if logged in without a permitted role.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.loggedIn || !req.session.user_id) {
      return res.status(401).send({ error: 'Authentication required' })
    }
    if (!allowedRoles.includes(req.session.role)) {
      return res.status(403).send({ error: 'Insufficient permissions' })
    }
    return next()
  }
}
