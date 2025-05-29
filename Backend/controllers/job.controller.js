import Job from '../models/job.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//admin job post

// "title":"Frontend Developer", 
//     "description":"0-2 years experience", 
//     "requirements":"MERN", 
//     "location":"Remote", 
//     "salary":"60000", 
//     "jobType":"Full-time", 
//     "companyId":"683764f9758d6229854fea55", 
//     "position":"15", 
//     "experience":"1"

export const postJob = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id is set by the authentication middleware
        //title, description, requirements, location, salary, jobType, company, position, created_by, application

        const { title, description, requirements, location, salary, jobType, companyId, position, experience } = req.body;

        if (!title || !description || !requirements || !location || !salary || !jobType || !companyId || !position || !experience) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','), // OR just use requirements if you keep it as string
            location,
            salary,
            jobType,
            company: companyId,
            position,
            experience: parseInt(experience),
            created_by: userId,
          });

        return res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job,
        });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

//for users
export const getAllJobs = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id is set by the authentication middleware
        const userJobs = await Job.find({ created_by: userId }).populate('company', 'companyName');

        const keyword = req.query.keyword | "";
        const query = {
            $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { requirements: { $regex: keyword, $options: 'i' } },
            { location: { $regex: keyword, $options: 'i' } },
            { position: { $regex: keyword, $options: 'i' } },  
            {jobType: { $regex: keyword, $options: 'i' } },
        ]
    };

        const jobs = await Job.find(query).populate({path: 'company'}).sort({ createdAt: -1 });  

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this user",
                success: false,
            });
        }
        
        return res.status(200).json({
            message: "Jobs retrieved successfully",
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("Error retrieving jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Get a specific job by ID 
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; // Assuming the job ID is passed as a URL parameter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Job retrieved successfully",
            success: true,
            job,
        });
    }
    catch (error) {
        console.error("Error retrieving job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}   

//admin job created
export const getAdminJobs = async (req, res) => {       
    try {
        const adminId = req.id; // Assuming req.id is set by the authentication middleware
        const jobs = await Job.find({ created_by: adminId });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this user",
                success: false,
            });
        }
        
        return res.status(200).json({
            message: "Jobs retrieved successfully",
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("Error retrieving admin jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}