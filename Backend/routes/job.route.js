import express from 'express';
import authenticateToken from '../middleware/isAuthenticated.js';
import {postJob, getAllJobs, getJobById, getAdminJobs} from '../controllers/job.controller.js';   

const router = express.Router();

router.route("/post").post(authenticateToken, postJob);
router.route("/get").get(authenticateToken, getAllJobs);
router.route("/get/:id").get(authenticateToken, getJobById);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);

export default router;

//api/job/post
//api/job/get             
//api/job/get/:id
//api/job/getadminjobs