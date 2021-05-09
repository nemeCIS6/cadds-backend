const settings = require("../../settings");
import accountService from "../../classes/service/accountService";
import hjr from "../../classes/happyJsonResponder";
import express from "express";
import UserSessionModel from "../../models/account/UserSessionModel";

declare global {
  namespace Express {
    interface Request {
      session: UserSessionModel;
    }
  }
}

export const authenticateRoute = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.get(settings.authenticationTokenName);
  if (token) {
    try {
      const session = await accountService.getSessionAsync(token.toString());
      if (session) {
        req.session = session;
        if (req.location) {
          const { longitude, latitude } = req.location;
          await accountService.updateSessionAsync(session, { longitude, latitude });
        }
        return next();
      }
    } catch (e) {
      console.log(e);
    }
  }
  return res.status(403).json(hjr.fail(null, "Authorization required"));
};
export default authenticateRoute;
