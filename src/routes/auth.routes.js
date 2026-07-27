import { Router } from "express";
import {
  refreshAccessToken,
  login,
  register,
  logout,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
