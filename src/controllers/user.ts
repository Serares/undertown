import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { TOKEN_SECRET, SENDGRID_API_KEY, CONTACT_EMAIL } from '../utils/secrets';
import { body, checkSchema, sanitize, validationResult } from 'express-validator';

import sendgridApi from '@sendgrid/mail';
sendgridApi.setApiKey(SENDGRID_API_KEY);

let getGigi = (email?: string, id?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let user = {
      name: "Gigi",
      password: "qiwei1i2easind1",
      email: CONTACT_EMAIL,
      id: "3921"
    };
    if (email === user.email || id === user.id) {
      resolve(user);
    } else {
      reject("Can't find user")
    }
  })
}

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
 * @route POST /user/signup
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  await body("email", "Email is not valid").isEmail().run(req);
  await body("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
  await body("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
  // eslint-disable-next-line @typescript-eslint/camelcase
  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // TODO log in winston
    return res.status(401).json({
      errors,
      message: "Validation failed"
    });
  }

  // send user data to db_api and save the user

  return res.json({
    message: "Registration success",
    user: req.body.email
  })
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
 * @route POST /user/login
 */
export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('login', (err, user, info) => {
    try {
      if (err) {
        const error = new Error('An error occurred.');

        return next(error);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      req.login(user, { session: false }, (error) => {
        if (error) return next(error);

        const payload = { id: user.id, name: user.name, email: user.email };
        const token = jwt.sign({ user: payload }, TOKEN_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}

/**
 * @route GET /adauga-properietate
 */
export const getSubmitProperty = (req: Request, res: Response, next: NextFunction) => {
  return res.render("pages/submit_property", {
    pageTitle: "Adauga",
    path: "/adauga-proprietate"
  });
}

/**
 * @route POST /user/submitProperty
 */
export const postSubmitProperty = (req: Request, res: Response, next: NextFunction) => {
  // TODO
}

/**
 * @route GET /resetare-parola/:resetToken
 */
export const getResetPassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    let tokenPayload = req.params.resetToken.split(".")[1];

    const parsedPayload = Buffer.from(tokenPayload, "base64").toString("binary");

    //TODO check if user exists on db
    return res.render("pages/auth/reset", {
      pageTitle: "Resetare parola",
      path: "/resetare-parola",
      userId: JSON.parse(parsedPayload).id,
      resetToken: req.params.resetToken,
    })
  } catch (err) {
    console.log(err);
    next(err)
  }

}

/**
 * @route POST /user/resetPassword
 */
export const postResetPassword = async (req: Request, res: Response, next: NextFunction) => {

  try {
    await body("password", "Password needs minimum 5 characters").isLength({ min: 5 }).run(req);
    //TODO get the user from db_api
    const user = await getGigi(null, req.body.userId);
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(401).json({ message: "Errors", errors });
    }
    jwt.verify(req.body.resetToken, user.password, (err: any, decoded: any) => {
      if (err) {
        throw err;
      }
      // TODO change the password in db_api
      return res.status(200).json({ message: "Password changed to" + req.body.password })
    });

  } catch (err) {
    console.log(err);
    //TODO winston log
    res.status(500).json({ message: "Something went wrong" })
  }

}

/**
 * @route GET /recuperare-parola
 */
export const getForgotPassword = (req: Request, res: Response, next: NextFunction) => {

  return res.render("pages/auth/forgot", {
    pageTitle: "Recuperare parola",
    path: "/recuperare-parola"
  })
}

/**
 * @route POST /user/forgotPassword
 */
export const postForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await body("email", "Email not correct").isEmail().run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Data is not correct"
      })
    }
    // TODO get the user from db_api
    let user = await getGigi(req.body.email);

    const signSecret = user.password;
    const token = jwt.sign({ id: user.id, email: user.email }, signSecret);
    
    const email = {
      to: req.body.email,
      from: CONTACT_EMAIL,
      subject: "UNDERTOWN MESAJ",
      html: `
    <h2>Numele: ${user.name}</h2>
    <h2>Email: ${user.email} </h2>
    <p>Acceseaza linkul de mai jos ca sa-ti resetezi parola</p>
    <a href="${req.protocol}://${req.get("host")}/resetare-parola/${token}">Link de resetare</a>
  `
    };

    sendgridApi.send(email)
      .then((data) => {
        return res.status(200).json({ message: "Email trimis, cu succes" })
      })
      .catch((err) => {
        console.log("Eroare trimitere email", req.body.email, err);
        return res.status(401).json({ message: "Emailul nu a putut fi trimis" })
      });

  } catch (err) {
    //TODO winston log
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

