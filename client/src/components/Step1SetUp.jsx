import React from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Step1SetUp({ onStart }) {
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        // Validation before sending request
        if (!role?.trim()) {
            alert("Please enter a role");
            return;
        }
        if (!experience?.trim()) {
            alert("Please enter experience");
            return;
        }
        if (!mode) {
            alert("Please select interview mode");
            return;
        }

        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , 
           {
               role: role.trim(), 
               experience: experience.trim(), 
               mode: mode.trim(),
               resumeText: resumeText?.trim() || "", 
               projects: projects || [], 
               skills: skills || [] 
           }, 
           {withCredentials: true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)

        } catch (error) {
            console.error("Error details:", error.response?.data || error.message)
            alert(error.response?.data?.message || "Failed to start interview")
            setLoading(false)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f8effa_0%,_#f4ebf7_50%,_#efe6f2_100%)] px-4'>

            <div className='w-full max-w-6xl bg-white/95 rounded-3xl shadow-[0_20px_60px_rgba(82,14,167,0.12)] border border-[#E7D8EA] grid md:grid-cols-2 overflow-hidden'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-[linear-gradient(135deg,_#f7ecfb_0%,_#efe2f3_100%)] p-12 flex flex-col justify-center'>

                    <h2 className="text-4xl font-bold text-[#322B3B] mb-6">
                        Start Your AI Interview
                    </h2>

                    <p className="text-[#6f567f] mb-10">
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaUserTie className="text-[#520EA7] text-xl" />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-[#520EA7] text-xl" />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-[#520EA7] text-xl" />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03 }}
                                    className='flex items-center space-x-4 bg-white/90 p-4 rounded-xl shadow-sm cursor-pointer border border-[#E7D8EA]'>
                                    {item.icon}
                                    <span className='text-[#322B3B] font-medium'>{item.text}</span>

                                </motion.div>
                            ))
                        }
                    </div>



                </motion.div>



                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12 bg-white">

                    <h2 className='text-3xl font-bold text-[#322B3B] mb-8'>
                        Interview SetUp
                    </h2>


                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-[#805093]' />

                            <input type='text' placeholder='Enter role'
                                className='w-full pl-12 pr-4 py-3 border border-[#D5BED9] rounded-xl focus:ring-2 focus:ring-[#805093] outline-none transition bg-[#FCF8FD]'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>


                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-[#805093]' />

                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3 border border-[#D5BED9] rounded-xl focus:ring-2 focus:ring-[#805093] outline-none transition bg-[#FCF8FD]'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />



                        </div>

                        <select required value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className='w-full py-3 px-4 border border-[#D5BED9] rounded-xl focus:ring-2 focus:ring-[#805093] outline-none transition bg-[#FCF8FD]'>
                    
                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>

                        </select>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-[#D5BED9] rounded-xl p-8 text-center cursor-pointer hover:border-[#520EA7] hover:bg-[#F4E8FB] transition'>

                                <FaFileUpload className='text-4xl mx-auto text-[#520EA7] mb-3' />

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='text-[#6f567f] font-medium'>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}

                                        className='mt-4 bg-gradient-to-r from-[#805093] to-[#520EA7] text-white px-5 py-2 rounded-lg transition'>
                                        {analyzing ? "Analyzing..." : "Analyze Resume"}



                                    </motion.button>)}

                            </motion.div>


                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-[#F9F2FC] border border-[#E7D8EA] rounded-xl p-5 space-y-4'>
                                <h3 className='text-lg font-semibold text-[#322B3B]'>
                                    Resume Analysis Result</h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium text-[#322B3B] mb-1'>
                                            Projects:</p>

                                        <ul className='list-disc list-inside text-[#6f567f] space-y-1'>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium text-[#322B3B] mb-1'>
                                            Skills:</p>

                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-[#EAD5F2] text-[#520EA7] px-3 py-1 rounded-full text-sm'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}


                        <motion.button
                        onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full disabled:bg-[#A174AF] bg-gradient-to-r from-[#805093] to-[#520EA7] hover:opacity-90 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-[0_12px_32px_rgba(82,14,167,0.18)]'>
                            {loading ? "Staring...":"Start Interview"}


                        </motion.button>
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}

export default Step1SetUp
