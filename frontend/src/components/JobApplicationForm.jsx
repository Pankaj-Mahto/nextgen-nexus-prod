import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const JobApplicationForm = ({ jobId }) => {
    const [open, setOpen] = useState(false);
    const [resume, setResume] = useState(null);
    const [videoResume, setVideoResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("resume", resume);
        if (videoResume) {
            formData.append("videoResume", videoResume);
        }

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Application submitted successfully!");
                setOpen(false);
                setResume(null);
                setVideoResume(null);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Apply Now</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply for Job</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="resume">Resume (PDF)</Label>
                        <Input
                            id="resume"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResume(e.target.files[0])}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="videoResume">Video Resume (Optional, MP4)</Label>
                        <Input
                            id="videoResume"
                            type="file"
                            accept="video/mp4"
                            onChange={(e) => setVideoResume(e.target.files[0])}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JobApplicationForm;