import express from 'express';
import { register } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import { logout } from '../controllers/user.controller.js';
import { updateProfile } from '../controllers/user.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/profile/update").put(authenticateToken, updateProfile);

export default router;