
import hjr from "../classes/happyJsonResponder";
import Express, { NextFunction } from "express";
import { authenticateRoute } from "../helpers/routeHelpers/authenticateRoute";
import { accountRouter } from "./account";
const projectRouter = require("./project");
const bodyParser = require("body-parser");
const settings = require("../settings");
import { allowOriginAndCredentialsRouteHelper } from "../helpers/routeHelpers/allowOriginAndCredentialsRouteHelper";
import { adminCheck } from "../helpers/routeHelpers/adminCheck";
import { locationRouteHelper } from './../helpers/routeHelpers/locationRouteHelper';
export const routes = Express.Router();
if (settings.media.serveStatic) {
  routes.use(settings.media.remotePath, Express.static(settings.media.filePath));
}
routes
  .use(allowOriginAndCredentialsRouteHelper)
  .use(bodyParser.json({ limit: settings.server.bodySizeLimit }))
  .use(locationRouteHelper)
  .use((error: Error, req: Express.Request, res: Express.Response, next: NextFunction) => {
    return res.status(400).json(hjr.fail(null, "bad json format"));
  })
  .use("/account", accountRouter)
  .use("*", authenticateRoute)
  .use("/project", projectRouter)
  .use("*", adminCheck)
  .use((error: Error, req: Express.Request, res: Express.Response, next: NextFunction) => {
    if (error) {
      console.error(error);
      return res.status(404).send(hjr.success({ url: req.originalUrl }, 'Resource not found'));
    }
    return next();
  });


export default routes;
