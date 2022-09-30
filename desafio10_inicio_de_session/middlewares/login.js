export function auth (req, res, next) {
     if (!req.session.name) {
      res.redirect("/login");
      return ;
    } 
    next();
}