import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from '../controllers/application.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route('/apply/:id').post(
    isAuthenticated,
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'videoResume', maxCount: 1 },
    ]),
    applyJob
);
router.route('/get').get(isAuthenticated, getAppliedJobs);
router.route('/job/:id/applicants').get(isAuthenticated, getApplicants); // Correct endpoint
router.route('/status/:id/update').post(isAuthenticated, updateStatus);

export default router;