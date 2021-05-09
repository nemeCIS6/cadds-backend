/**
 * (c) Rogier van Poppel, 2019
 * 
 **/


const hjr = require("../../classes/happyJsonResponder");
import express from "express";

export const adminCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.user.isAdmin) {
    return next();
  }
  return res.status(403).json(hjr.fail(null, "Admin authorization required"));
};
