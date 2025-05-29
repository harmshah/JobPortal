import express from 'express';
import authenticateToken from '../middleware/isAuthenticated.js';
import {applyJob, getAppliedJobs, getApllicants, updateStatus} from '../controllers/application.controller.js';   

const router = express.Router();

router.route("/apply/:id").get(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router.route("/:id/applicants").get(authenticateToken, getApllicants);
router.route("/status/:id/update").post(authenticateToken, updateStatus);

export default router;

// //api/application/apply/:id
// //api/application/get
// //api/application/:id/applicants
// //api/application/status/:id/update
