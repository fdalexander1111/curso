export function auth (req, res, next) {
   /* if (!req.session.username) {
     res.redirect("/login");
     return ;
   } */
   next();
}