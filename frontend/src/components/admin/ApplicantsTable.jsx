import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = ['accepted', 'rejected']; // Matches enum, excludes 'pending' for admin updates

const ApplicantsTable = ({ jobId }) => {
    const dispatch = useDispatch();
    const { applicants } = useSelector((store) => store.application);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/job/${jobId}/applicants`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job.applications || []));
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch applicants.');
            }
        };
        if (jobId) fetchApplicants();
    }, [jobId, dispatch]);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                const refetch = await axios.get(`${APPLICATION_API_END_POINT}/job/${jobId}/applicants`, {
                    withCredentials: true,
                });
                if (refetch.data.success) {
                    dispatch(setAllApplicants(refetch.data.job.applications || []));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status.');
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applicants</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Video Resume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(applicants) && applicants.length > 0 ? (
                        applicants.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname || 'N/A'}</TableCell>
                                <TableCell>{item?.applicant?.email || 'N/A'}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                                <TableCell>
                                    {item?.resume?.url ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item.resume.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Resume
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.videoResume?.url ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="link">View Video Resume</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Video Resume</DialogTitle>
                                                </DialogHeader>
                                                <video controls className="w-full">
                                                    <source src={item.videoResume.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <span>No Video</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                                </TableCell>
                                <TableCell>{item?.createdAt?.split('T')[0] || 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="cursor-pointer" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    key={index}
                                                    className="flex w-fit items-center my-2 cursor-pointer"
                                                >
                                                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                No applicants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;