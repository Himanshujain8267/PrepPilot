import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../config'
import { FaArrowLeft } from 'react-icons/fa'
import Navbar from '../components/Navbar'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8effa_0%,_#f4ebf7_50%,_#efe6f2_100%)] py-10' >
            <Navbar />
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 rounded-[32px] bg-white/95 border border-[#E7D8EA] shadow-[0_24px_70px_rgba(82,14,167,0.08)] p-6'>
                    <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
                        <div className='flex items-start gap-4 md:items-center'>
                            <button
                                onClick={() => navigate("/")}
                                className='shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EBFF] border border-[#E7D8EA] text-[#520EA7] shadow-sm transition hover:bg-[#EAD5F2]'>
                                <FaArrowLeft className='text-xl' />
                            </button>

                            <div className='min-w-0'>
                                <h1 className='text-3xl font-semibold text-[#2B2431]'>
                                    Interview History
                                </h1>
                                <p className='text-[#6f567f] mt-2 max-w-xl leading-7'>
                                    See your completed interview sessions, scores, and status at a glance.
                                </p>
                            </div>
                        </div>

                        <div className='rounded-full bg-[#F4ECFF] px-5 py-3 text-sm font-semibold text-[#5B3E7A] shadow-sm'>
                            {interviews.length === 0 ? "No sessions yet" : `${interviews.length} interview${interviews.length > 1 ? 's' : ''}`}
                        </div>
                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className='flex min-h-[260px] items-center justify-center rounded-[32px] bg-white/90 border border-[#E7D8EA] p-12 shadow-[0_16px_45px_rgba(82,14,167,0.08)]'>
                        <div className='max-w-lg text-center'>
                            <p className='text-xl font-semibold text-[#322B3B]'>No interviews found yet</p>
                            <p className='mt-3 text-[#6f567f]'>Upload your resume and start your first practice interview to build history and receive AI feedback.</p>
                        </div>
                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                                onClick={()=>navigate(`/report/${item._id}`)}
                                className='overflow-hidden rounded-[32px] bg-white/95 p-6 shadow-[0_20px_60px_rgba(82,14,167,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(82,14,167,0.12)] cursor-pointer border border-[#E7D8EA]'>
                                <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
                                    <div className='min-w-0 space-y-2'>
                                        <h3 className="text-2xl font-semibold text-[#322B3B] truncate">
                                            {item.role}
                                        </h3>
                                        <p className="text-sm text-[#6f567f] truncate">
                                            {item.experience} • {item.mode}
                                        </p>
                                    </div>

                                    <div className='rounded-full bg-[#F3EDF9] px-4 py-2 text-sm font-semibold text-[#5B3E7A]'>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className='mt-6 grid gap-4 md:grid-cols-3'>
                                    <div className='rounded-3xl bg-[#F9F4FF] p-4'>
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#7F6A9E]">Questions</p>
                                        <p className="mt-2 text-xl font-semibold text-[#322B3B]">{item.questions?.length || 0}</p>
                                    </div>

                                    <div className='rounded-3xl bg-[#F9F4FF] p-4'>
                                        <p className='text-xs uppercase tracking-[0.2em] text-[#7F6A9E]'>Status</p>
                                        <p className='mt-2 text-xl font-semibold text-[#520EA7]'>{item.status}</p>
                                    </div>

                                    <div className='rounded-3xl bg-[#F9F4FF] p-4 text-right'>
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#7F6A9E]">Score</p>
                                        <p className="mt-2 text-2xl font-bold text-[#520EA7]">{item.finalScore || 0}/10</p>
                                    </div>
                                </div>
                            </div>

                        ))
                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default InterviewHistory
