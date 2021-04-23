import { Request, Response, NextFunction } from 'express';
import { SENDGRID_API_KEY, CONTACT_EMAIL } from '../utils/secrets';
import { body, sanitize, validationResult } from 'express-validator';
import { IRequestUserCredentials } from '../interfaces/IRequestUserCredentials';
import { EPropertyTypes } from '../interfaces/EPropertyTypes';
import ISubmitedProperty from '../interfaces/ISubmitedProperty';
import { dbApiRequest } from '../services/serverRequests';
import logger, { timeNow } from '../utils/logger';
import sendgridApi from '@sendgrid/mail';
import faker from 'faker';
import { sendJSONresponse } from '../utils/sendjsonresponse';
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
    return sendJSONresponse(res, 401, {
      errors,
      message: "Validation failed"
    })
  }

  let dbData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber
  };

  try {
    const response = await dbApiRequest.post("/user/signup", dbData);
    return sendJSONresponse(res, 200, response.data);
  } catch (err) {
    if (err.response && err.response.status) {
      logger.debug("Error postSignup -> " + timeNow);
      return sendJSONresponse(res, err.response.status, err.response.data);
    }

    return sendJSONresponse(res, 500, { message: "Server error" });
  }

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
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  await body("email", "Email is not valid").isEmail().run(req);
  await body("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
  // eslint-disable-next-line @typescript-eslint/camelcase
  await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendJSONresponse(res, 401, {
      errors,
      message: "Validation failed"
    })
  }

  try {
    const data = {
      email: req.body.email,
      password: req.body.password
    };

    let response = await dbApiRequest.post("/user/login", data);
    //TODO find out how the response looks
    console.log(response);
    return sendJSONresponse(res, 200, response.data);
  } catch (err) {
    if (err.response && err.response.status) {
      logger.debug("Error postSubmitProperty -> " + timeNow);
      return sendJSONresponse(res, err.response.status, err.response.data);
    }

    return sendJSONresponse(res, 500, { message: "Server error" });
  }
}

/**
 * @route GET /adauga-properietate
 */
export const getSubmitProperty = (req: Request, res: Response, next: NextFunction) => {
  // TODO add a better route validation than this
  let isLoggedIn = Number(req.query.logged);
  if (isLoggedIn) {
    return res.render("pages/submit_property", {
      pageTitle: "Adauga",
      path: "/adauga-proprietate"
    });
  } else {
    return res.status(301).redirect('/login');
  }
}

/**
 * @route POST /adauga-proprietate
 */
export const postSubmitProperty = async (req: IRequestUserCredentials, res: Response, next: NextFunction) => {
  try {

    let propertyData: ISubmitedProperty = {
      title: req.body.title,
      description: req.body.description,
      transactionType: req.body.transactionType,
      propertyType: req.body.propertyType,
      surface: req.body.surface,
      rooms: null,
      price: req.body.price,
      address: req.body.address
    };

    if (propertyData.propertyType !== EPropertyTypes.LANDANDCOMMERCIAL) {
      propertyData.rooms = req.body.rooms;
    };

    if (req.files && req.tokenPayload) {
      propertyData.imagesUrls = req.tokenPayload.imagesUrls;
      propertyData.gcsSubfolderId = req.tokenPayload.subdirectoryId;
    };

    let objectForDb = {
      userEmail: req.tokenPayload.email,
      submitedProperty: propertyData
    };


    let response = await dbApiRequest.post("/user/submitProperty", objectForDb);
    if (response.data) {
      return sendJSONresponse(res, 200, response.data);
    }
  } catch (err) {
    if (err.response && err.response.status) {
      logger.debug("Error postSubmitProperty -> " + timeNow);
      return sendJSONresponse(res, err.response.status, err.response.data);
    }

    return sendJSONresponse(res, 500, { message: "Server error" });
  }
}

/**
 * @route GET /resetare-parola/:resetToken
 */
export const getResetPassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    let tokenPayload = req.params.resetToken.split(".")[1];

    /* payload structure {shortId: string, email: string} */
    const parsedPayload = Buffer.from(tokenPayload, "base64").toString("binary");

    //TODO check if user exists on db
    return res.render("pages/auth/reset", {
      pageTitle: "Resetare parola",
      path: "/resetare-parola",
      userId: JSON.parse(parsedPayload).shortId,
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
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(401).json({ message: "Errors", errors });
    }
    const response = await dbApiRequest.post("/user/resetPassword", {
      shortId: req.body.userId,
      newPassword: req.body.password,
      token: req.body.resetToken
    });
    return sendJSONresponse(res, 200, { message: "Password reset success" });
  } catch (err) {
    //TODO winston log
    console.log(err);
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
      return sendJSONresponse(res, 400, {
        message: "Data is not correct"
      })
    }

    const response = await dbApiRequest.post("/user/forgotPassword", { email: req.body.email });

    const email = {
      to: req.body.email,
      from: CONTACT_EMAIL,
      subject: "UNDERTOWN MESAJ",
      html: `
    <h2>Numele: ${response.data.name}</h2>
    <h2>Email: ${response.data.email} </h2>
    <p>Acceseaza linkul de mai jos ca sa-ti resetezi parola</p>
    <a href="${req.protocol}://${req.get("host")}/resetare-parola/${response.data.token}">Link de resetare</a>
  `
    };

    sendgridApi.send(email)
      .then((data) => {
        return sendJSONresponse(res, 200, { message: "Email trimis, cu succes" });
      })
      .catch((err) => {
        console.log("Eroare trimitere email", req.body.email, err);
        return sendJSONresponse(res, 401, { message: "Emailul nu a putut fi trimis" });
      });

  } catch (err) {
    console.log(err);
    logger.debug("Error in forgotPassword-> " + timeNow);
    return sendJSONresponse(res, 500, { message: "Something went wrong" });
  }
}

