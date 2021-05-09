const hjr = require("../classes/happyJsonResponder");
import express from "express";
import accountService from "../classes/service/accountService";
const validator = require("validator");
const missingFields = require("../helpers/missingFields");
import { authenticateRoute } from "../helpers/routeHelpers/authenticateRoute";
import { adminCheck } from "../helpers/routeHelpers/adminCheck";
//import socialAccountRouter from "./account/social";
import UserModel from "../models/account/UserModel";
const settings = require("../settings");
const log = require("../classes/log");

export const accountRouter = express.Router()
    //.use("/social", socialAccountRouter)
    .post("/login", async (req, res, next) => {
        let missing = missingFields(req.body, ["email", "password"]);
        if (missing) {
            return res
                .status(417)
                .json(hjr.fail([], "Expected post field for " + missing.join(", ")));
        }
        let { email, password, location, pushNotificationToken } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(417).json(hjr.fail([], "Email invalid"));
        }
        let lookupUser = await accountService.getByEmailAsync(email.toLowerCase());

        if (!lookupUser) {
            return res
                .status(404)
                .json(
                    hjr.fail(
                        { email, password },
                        "Unknown combination of username and password"
                    )
                );
        }

        let user = await accountService.loginAsync(email.toLowerCase(), password);
        if (!user) {
            return res
                .status(404)
                .json(
                    hjr.fail(
                        { email, password },
                        "Unknown combination of username and password"
                    )
                );
        }

/*         if (!user.activated && !user.isAdmin) {
            //user is not activated. now check if activation has been posted
            let { activationCode } = req.body;
            if (activationCode && parseInt(activationCode) !== 0) {
                //user  posted an activationcode
                if (
                    parseInt(activationCode) ===
                    parseInt(accountService.getActivationCode(user))
                ) {
                    //user posted correct activationcode, let's activte the account
                    accountService.activateAsync(user);
                    user.activated = new Date();
                    // we do not need to await
                } else {
                    return res
                        .status(424)
                        .json(hjr.fail({ email }, "Incorrect activation code"));
                }
            } else {
                return res
                    .status(424)
                    .json(hjr.fail({ email }, "Account has not been activated"));
            }
        } */

        let session = await accountService.createSessionAsync(
            user,
            pushNotificationToken,
            req.location
        );
        if (session) {
            return res.json(hjr.success(session.toObj()));
        }
        return res.status(400).json(hjr.fail([], "Cannot create session"));
    })
    .post("/resendCode", async (req, res, next) => {
        let missing = missingFields(req.body, ["email", "password"]);
        if (missing) {
            return res
                .status(417)
                .json(hjr.fail([], "Expected post field for " + missing.join(", ")));
        }
        let { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(417).json(hjr.fail([], "Email invalid"));
        }
        let user = await accountService.loginAsync(email.toLowerCase(), password);
        if (!user) {
            return res
                .status(404)
                .json(
                    hjr.fail(
                        { email, password },
                        "Unknown combination of username and password"
                    )
                );
        }
        if (user.activated) {
            return res
                .status(421)
                .json(hjr.fail({ email, password }, "Account is already active"));
        }
        try {
            await accountService.sendActivationCodeAsync(user);
            return res
                .status(202)
                .json(hjr.success(null, `Code sent to user email ${user.email}`));
        } catch (e) {
            return res
                .status(e.code || 400)
                .json(hjr.fail({ email, password }, e.message || "UNKNOWN ERROR"));
        }
    })
    .put("/create", async (req, res, next) => {
        let missing = missingFields(req.body, [
            "email",
            "password",
            "firstName",
            "lastName",
            "position"
        ]);
        if (missing) {
            return res
                .status(417)
                .json(hjr.fail([], "Expected post field for " + missing.join(", ")));
        }
        let { email, password, firstName, lastName, position } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(417).json(hjr.fail("Email invalid"));
        }

        email = email.toLowerCase();
        let userExists: false | UserModel = await accountService.getByEmailAsync(
            email
        );
        if (userExists) {
            return res
                .status(406)
                .json(
                    hjr.fail({}, `You have already registered. Please login instead`)
                );
        }

        if (
            await accountService.createAccountAsync(
                email,
                firstName,
                lastName,
                password,
                "user",
                position,
                true
            )
        ) {
            return res.status(201).send(hjr.success([], "User created"));
        }
        return res.status(500).send(hjr.fail([], "Unknown error"));
    })
    .get("/passwordReset/:email", async (req, res, next) => {
        const { email } = req.params;
        if (!validator.isEmail(email)) {
            return res.status(417).json(hjr.fail([], "Email invalid"));
        }
        let lookupUser = await accountService.getByEmailAsync(email.toLowerCase());
        if (!lookupUser) {
            return res.status(404).json(hjr.fail({ email }, "User not found"));
        }
        try {
            await accountService.createPasswordReset(lookupUser, true);
            return res
                .status(201)
                .send(hjr.success({ email }, `Reset password code sent to ${email}`));
        } catch (e) {
            return res
                .status(e.code || 400)
                .json(hjr.fail({ email }, e.message || "UNKNOWN ERROR"));
        }
    })
    .post("/passwordReset/:email", async (req, res, next) => {
        const { email } = req.params;
        if (!validator.isEmail(email)) {
            return res.status(417).json(hjr.fail([], "Email invalid"));
        }
        let missing = missingFields(req.body, ["password", "code"]);
        if (missing) {
            return res
                .status(417)
                .json(
                    hjr.fail(req.body, "Expected post field for " + missing.join(", "))
                );
        }
        const { password, code } = req.body;
        let lookupUser = await accountService.getByEmailAsync(email.toLowerCase());
        if (!lookupUser) {
            return res.status(404).json(hjr.fail({ email }, "User not found"));
        }
        try {
            let pr = await accountService.resetPasswordAsync(
                lookupUser,
                code,
                password
            );
            if (!pr) {
                throw { message: "Could not reset password" };
            }
            return res
                .status(201)
                .json(
                    hjr.success({ email, password }, "Successfully changed password")
                );
        } catch (e) {
            return res
                .status(e.code || 400)
                .json(
                    hjr.fail({ email, password, code }, e.message || "UNKNOWN ERROR")
                );
        }
    })
    .get("/logout", async (req, res, next) => {
        const token = req.get(settings.authenticationTokenName);
        if (token) {
            await accountService.logoutAsync(token.toString());
        }
        return res.json(hjr.success(null, "Logged out successfully"));
    })
    .use("*", authenticateRoute)
    .get("/checkSession", (req, res, next) => {
        res.json(hjr.success(req.session.toObj()));
    })
    .patch("/:id?", async (req, res, next) => {
        if (req.params.id && !validator.isInt(req.params.id)) {
            return next();
        }
        let patch: any = {};

        ["firstName", "lastName"].forEach(item => {
            if (req.body[item] !== undefined) {
                patch[item] = req.body[item];
            }
        });
        if (req.body.email !== undefined && req.body.email.length > 0) {
            if (!validator.isEmail(req.body.email)) {
                return res.status(417).json(hjr.fail("Email invalid"));
            }
            patch.email = req.body.email;
        }
        ["newPassword", "photo"].forEach(item => {
            if (req.body[item] !== undefined) {
                patch[item] = req.body[item];
            }
        });

        let userId = req.session.user.id;

        if (req.session.user.isAdmin && req.params.id) {
            userId = parseInt(req.params.id);
            ["roleId", "activated"].forEach(item => {
                if (req.body[item] !== undefined) {
                    patch[item] = req.body[item];
                }
            });
        }

        if (!Object.keys(patch).some(key => patch.hasOwnProperty(key))) {
            return res
                .status(417)
                .json(hjr.fail({}, "Did not find any patchable fields"));
        }

        if (patch.newPassword) {
            let missing = missingFields(req.body, ["oldPassword"]);
            if (missing) {
                return res
                    .status(417)
                    .json(
                        hjr.fail(req.body, "Expected post field for " + missing.join(", "))
                    );
            }
            let oldPassword: string = req.body.oldPassword;
            if (req.body.newPassword !== undefined) {
                patch.newPassword = req.body.newPassword;
            }

            if (
                !(await accountService.loginAsync(req.session.user.email, oldPassword))
            ) {
                return res
                    .status(403)
                    .json(hjr.fail(req.body, "Invalid password provided"));
            }
        }

        let patchUser: number | false = false;
        try {
            patchUser = await accountService.patchAsync(userId, patch);
        } catch (e) {
            return res.status(400).json(hjr.fail(patchUser, "failed patching user"));
        }

        if (patchUser) {
            let userReturn: UserModel | false | null = false;
            try {
                userReturn = await accountService.getAsync(userId, true);
                if (userReturn) {
                    return res.status(200).json(hjr.success(userReturn.toObj()));
                }
            } catch (e) {
                log.error(e);
                return res
                    .status(400)
                    .json(
                        hjr.fail(userReturn, "failed retrieving updated user information")
                    );
            }
        }
        return res.status(400).json(hjr.fail(patchUser, "unknown error"));
    })
    .use("*", adminCheck)
    .get("/:id", async (req, res, next) => {
        if (!validator.isInt(req.params.id)) {
            return next();
        }
        const id = parseInt(req.params.id);
        const user = await accountService.getAsync(id, req.session.user.isAdmin);
        if (!user) {
            return res.status(404).json(hjr.fail({}, "User not found"));
        }
        return res.json(hjr.success(user.toObj()));
    })
    .get("/list", async (req, res, next) => {
        let skip = parseInt(req.query.skip) || 0;
        let take = parseInt(req.query.take) || 25;

        take = take > 100 ? 100 : take;
        const list = await accountService.listAsync(skip, take);
        if (!list) {
            return res.status(400).json(hjr.fail({}, "Unknown error"));
        }
        return res.json(hjr.success(list.toObj()));
    });

export default accountRouter;
