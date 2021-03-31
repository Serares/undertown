import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { TOKEN_SECRET } from '../utils/secrets';

/**
 * @route GET /creare-cont
 */
export const getSignup = (req: Request, res: Response, next: NextFunction) => {
  return res.render("pages/auth/signup", {
    pageTitle: "Creare cont",
    path: "/signup"
  });
}

/**
 * @route GET /autentificare
 */
export const getLogin = (req: Request, res: Response, next: NextFunction) => {
  return res.render("pages/auth/login", {
    pageTitle: "Autentificare",
    path: "/login"
  });
}

/**
 * @route POST /signup
 */
export const postSignup = (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: "Signup success",
    user: req.user
  })
}

/**
 * @route POST /login
 */
export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('login', (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');

        return next(error);
      }

      req.login(user, { session: false }, (error) => {
        if (error) return next(error);

        const payload = { name: user.name, email: user.email };
        const token = jwt.sign({ user: payload }, TOKEN_SECRET);

        return res.status(200).json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}
