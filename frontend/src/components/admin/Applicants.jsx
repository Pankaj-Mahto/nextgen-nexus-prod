import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { setSingleJob } from '@/redux/jobSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants, singleJob } = useSelector((store) => store.application);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch applicants
                const applicantsRes = await axios.get(`${APPLICATION_API_END_POINT}/job/${params.id}/applicants`, {
                    withCredentials: true,
                });
                if (applicantsRes.data.success) {
                    dispatch(setAllApplicants(applicantsRes.data.job.applications || []));
                }

                // Fetch job details
                const jobRes = await axios.get(`${JOB_API_END_POINT}/${params.id}`, {
                    withCredentials: true,
                });
                if (jobRes.data.success) {
                    dispatch(setSingleJob(jobRes.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [params.id, dispatch]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10">
                {singleJob ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">{singleJob.title}</h1>
                        <div className="mb-6">
                            <p className="text-gray-700"><strong>Company:</strong> {singleJob?.company?.name || 'N/A'}</p>
                            <p className="text-gray-700"><strong>Description:</strong> {singleJob?.description || 'N/A'}</p>
                            <p className="text-gray-700"><strong>Location:</strong> {singleJob?.location || 'N/A'}</p>
                            <p className="text-gray-700"><strong>Salary:</strong> {singleJob?.salary || 'N/A'}</p>
                            <p className="text-gray-700"><strong>Posted:</strong> {singleJob?.createdAt?.split('T')[0] || 'N/A'}</p>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-700">Loading job details...</p>
                )}
                <h2 className="font-bold text-xl my-5">
                    Applicants ({Array.isArray(applicants) ? applicants.length : 0})
                </h2>
                <ApplicantsTable jobId={params.id} />
            </div>
        </div>
    );
};

export default Applicants;