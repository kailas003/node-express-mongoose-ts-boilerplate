import { Router } from "express";
import { authController } from "../controllers/auth";

const routes = Router();

routes.post("/login", (req, res , next ) => {
    authController.login(req, res , next );
});
routes.post("/signup", (req, res , next ) => {
    authController.signup(req, res , next );
});
routes.post("/logout", (req, res ) => {
    authController.logout(req, res);
});

export const authRoutes = routes;