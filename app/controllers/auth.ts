import moment from "moment";
import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import * as jwt from "jwt-simple";
import "../configs/passport.conf";

class AuthController {
  constructor() {
  }

  /**
   * POST /login
   * Sign in using email and password.
   */
  public login(req: Request, res: Response, next: NextFunction) {
    req.check("email", "Email is not valid").isEmail();
    req.check("password", "Password cannot be blank").notEmpty();
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json({ errors: errors });
    }

    passport.authenticate(
      "local",
      { session: false, failWithError: true },
      (err: Error, user: UserModel, info: IVerifyOptions) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(422).json({ errors: info.message });
        }
        req.logIn(user, err => {
          if (err) {
            return next(err);
          }
          return res.json(this.genToken(user));
        });
      }
    )(req, res, next);
  }

  /**
   * GET /logout
   * Log out.
   */
  public logout(req: Request, res: Response) {
    req.logout();
    res.redirect("/");
  }

  /**
   * POST /signup
   * Create a new local account.
   */
  public signup(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "Email is not valid").isEmail();
    req
      .assert("password", "Password must be at least 4 characters long")
      .len({ min: 4 });
    req
      .assert("confirmPassword", "Passwords do not match")
      .equals(req.body.password);
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json({ errors: errors });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        const errors = {
          msg: "Account with that email address already exists."
        };
        return res.status(422).json({ errors: errors });
      }
      user.save(err => {
        if (err) {
          return next(err);
        }
        req.logIn(user, err => {
          if (err) {
            return next(err);
          }
          return res.json(this.genToken(user));
        });
      });
    });
  }

  private genToken(user: any): Object {
    let expires = moment()
      .utc()
      .add({ days: 7 })
      .unix();
    let token = jwt.encode(
      {
        exp: expires,
        email: user.email
      },
      process.env.JWT_SECRET || "secret"
    );
    return {
      token: "JWT " + token,
      expires: moment.unix(expires).format(),
      user: user._id
    };
  }
}
export const authController = new AuthController();