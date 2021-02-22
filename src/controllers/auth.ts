import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import { RequestSessionType } from "../interfaces/RequestSessionType";
import crypto from "crypto";

export class AuthController {

  public getLogin(req: Request, res: Response, next: NextFunction): void {
    let message = req.flash("message");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      imageUrl: "/img/hero-image.jpg",
      //get the key set when redirected this is sent as an array so might check if the array is empty or not
      errorMessage: message,
      oldInput: {
        email: "",
        password: ""
      },
      validationErrors: []
    });
  }

  public postLogin(req: RequestSessionType, res: Response, next: NextFunction): void {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        imageUrl: "/img/hero-image.jpg",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
    }
    // check after email
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            imageUrl: "/img/hero-image.jpg",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: errors.array()
          });
        }
        //use bcrypt to decrypt the password found in the db
        // bcrypt .compare() goes to then if pass matches or not
        // in catch only for an error
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              // here we are adding the auth with the user object so it can be used in other controllers
              return req.session.save(err => {
                console.log(err);
                const userStatus = user.status;
                if (userStatus === "admin") {
                  res.redirect("/admin");
                } else {
                  res.redirect("/");
                }
              });
            } else {
              return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                errorMessage: "Invalid email or password",
                imageUrl: "/img/hero-image.jpg",
                oldInput: {
                  email: email,
                  password: password
                },
                validationErrors: errors.array()
              });
            }
          })
          .catch(err => {
            console.log(err);
            res.redirect("/login");
          });
      })
      .catch(err => console.log(err));
  }

  public getSignup(req: Request, res: Response, next: NextFunction): void {

    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: message,
      imageUrl: "/img/hero-image.jpg",
      oldInput: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
      },
      validationErrors: []
    });
  }

  public postSignup(req: Request, res: Response, next: NextFunction): void {
    // TODO create an interface/ class to hold this data
    const email: string = req.body.email;
    const password: string = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    console.log("Got the data", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        imageUrl: "/img/hero-image.jpg",
        oldInput: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword,
          phoneNumber: phoneNumber
        },
        validationErrors: errors.array()
      });
    }
    //encrypting the password with bcrypt package and this returns a promise
    bcrypt
      .hash(password, 8)
      .then(hashedPassword => {
        // here the user is created with the hased password
        const user = new User({
          email: email,
          password: hashedPassword,
          phoneNumber: phoneNumber,
          firstName: firstName,
          lastName: lastName
        });
        return user.save();
      })
      .then(result => {
        const msg = {
          to: email,
          from: "suport@undertown.ro",
          subject: "Signup succeded!",
          html: "<h1>Salutare</h1>"
        };
        // TODO create a sending emails method
        res.redirect("/login");
        return "Mesaj"
      })
      .then((data) => {
        console.log("Email sent success", data);
      })
      .catch(err => {
        console.log("SignUp error: ", err);
      });
  }


  public adminLogout(req: RequestSessionType, res: Response, next: NextFunction): void {

    req.session.destroy((err) => {
      console.log("Deleting Session");
      // deleting the session from mongodb and cookie from browser
      console.log(err);
      res.redirect("/login");
    });
  }

  public basicLogout(req: RequestSessionType, res: Response, next: NextFunction): void {
    req.session.destroy((err: any) => {
      console.log("Deleting session");
      res.status(200).json({ message: "Logged out user" + req.user.firstName });
    });
  }

  public getReset(req: Request, res: Response, next: NextFunction): void {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      errorMessage: message
    });
  }

  public postReset(req: Request, res: Response, next: NextFunction): void {
    // here we create a token that is going to be storred in the users object in the DB
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");
      //sending the email from the reset password form
      try {
        const foundUser = await User.findOne({ email: req.body.email });
        if (foundUser) {
          //if the user is found we add the token and expiration date
          foundUser.resetToken = token;
          foundUser.resetTokenExpiration = Date.now() + 3600000;
          await foundUser.save();
          return res.redirect("/");
          //sending the email with the token
          // TODO in the link of the email it will pe the domain link from .env
          // TODO create a method for sending emails
          // sgMail.send({
          //   to: req.body.email,
          //   from: "suport@undertown.ro",
          //   subject: "Password reset",
          //   html: `
          //     <p>You requested a password reset</p>
          //     <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          //   `
          // });

        } else {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  public getNewPassword(req: Request, res: Response, next: NextFunction): void {
    const token = req.params.token;
    //1h expiration date meaning if you use the token after 1h it wont be available
    //finding a user that has the token
    // resetTokenExpiration: { $gt: Date.now() } this is how to check if the tokenExpiration $greaterThan Date.now()
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash("error");
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        if (user) {
          res.render("auth/new-password", {
            path: "/new-password",
            pageTitle: "New Password",
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }


  public postNewPassword(req: Request, res: Response, next: NextFunction): void {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser: IUser | null;
    // here we get the new password and update the user with a new hased one
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        if (!resetUser) {
          throw new Error("Didn't found the user");
        }
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        req.flash("message", "Your password has been changed");
        res.redirect("/login");
      })
      .catch(err => {
        console.log(err);
      });
  }
}

