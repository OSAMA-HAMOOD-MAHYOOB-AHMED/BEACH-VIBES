// role comes from the JWT (see utils/jwt.js / auth.routes.js), so a role
// change takes effect on the user's next login rather than immediately —
// acceptable given tokens expire after JWT_EXPIRES_IN (default 7d).
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
