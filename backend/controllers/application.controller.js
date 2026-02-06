import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { cloudinary } from '../utils/cloudinary.js';

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: 'Job ID is required.',
                success: false,
            });
        }

        console.log('req.files:', req.files);

        const resume = req.files?.resume ? req.files.resume[0] : null;
        const videoResume = req.files?.videoResume ? req.files.videoResume[0] : null;

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: 'You have already applied for this job.',
                success: false,
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false,
            });
        }

        if (!resume) {
            return res.status(400).json({
                message: 'Resume is required.',
                success: false,
            });
        }

        const resumeUpload = await cloudinary.uploader.upload(resume.path, {
            folder: 'job_portal',
            resource_type: 'auto',
            public_id: `${Date.now()}-resume`, // Ensure unique public_id
        });
        console.log('Resume upload result:', resumeUpload); // Debug log

        let videoResumeData = {};
        if (videoResume) {
            const videoUpload = await cloudinary.uploader.upload(videoResume.path, {
                folder: 'job_portal',
                resource_type: 'video',
                public_id: `${Date.now()}-videoResume`,
            });
            videoResumeData = {
                public_id: videoUpload.public_id,
                url: videoUpload.secure_url,
            };
            console.log('Video resume upload result:', videoUpload); // Debug log
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            resume: {
                public_id: resumeUpload.public_id,
                url: resumeUpload.secure_url,
            },
            videoResume: Object.keys(videoResumeData).length > 0 ? videoResumeData : undefined,
            status: 'pending',
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: 'Job applied successfully.',
            success: true,
        });
    } catch (error) {
        console.error('Error in applyJob:', error);
        return res.status(500).json({
            message: error.message || 'Server error while submitting application.',
            success: false,
        });
    }
};



export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                },
            });
        if (!application || application.length === 0) {
            return res.status(404).json({
                message: 'No applications found.',
                success: false,
            });
        }
        return res.status(200).json({
            application,
            success: true,
        });
    } catch (error) {
        console.error('Error in getAppliedJobs:', error);
        return res.status(500).json({
            message: 'Server error while fetching applications.',
            success: false,
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: {
                path: 'applicant',
                select: 'fullname email phoneNumber profile',
            },
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success: true,
        });
    } catch (error) {
        console.error('Error in getApplicants:', error);
        return res.status(500).json({
            message: 'Server error while fetching applicants.',
            success: false,
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false,
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: 'Application not found.',
                success: false,
            });
        }

        // Validate status against enum
        const validStatuses = ['pending', 'accepted', 'rejected'];
        const normalizedStatus = status.toLowerCase();
        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.`,
                success: false,
            });
        }

        application.status = normalizedStatus;
        await application.save();

        return res.status(200).json({
            message: 'Status updated successfully.',
            success: true,
        });
    } catch (error) {
        console.error('Error in updateStatus:', error);
        return res.status(500).json({
            message: 'Server error while updating status.',
            success: false,
        });
    }
};