// middleware/authorizeRole.js
export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }
    next();
  };
}
