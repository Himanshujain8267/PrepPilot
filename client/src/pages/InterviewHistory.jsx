import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
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
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-white/90 border border-[#E7D8EA] shadow hover:shadow-md transition'><FaArrowLeft className='text-[#520EA7]' /></button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-[#322B3B]'>
                            Interview History
                        </h1>
                        <p className='text-[#6f567f] mt-2'>
                            Track your past interviews and performance reports
                        </p>

                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className='bg-white/90 border border-[#E7D8EA] p-10 rounded-2xl shadow-[0_16px_45px_rgba(82,14,167,0.08)] text-center'>
                        <p className='text-[#6f567f]'>
                            No interviews found. Start your first interview.
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                            onClick={()=>navigate(`/report/${item._id}`)}
                             className='bg-white/90 p-6 rounded-2xl shadow-[0_16px_45px_rgba(82,14,167,0.08)] hover:shadow-[0_20px_50px_rgba(82,14,167,0.12)] transition-all duration-300 cursor-pointer border border-[#E7D8EA]'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#322B3B]">
                                            {item.role}
                                        </h3>

                                        <p className="text-[#6f567f] text-sm mt-1">
                                            {item.experience} • {item.mode}
                                        </p>

                                        <p className="text-xs text-[#805093] mt-2">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#520EA7]">
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs text-[#805093]">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed"
                                                    ? "bg-[#EAD5F2] text-[#520EA7]"
                                                    : "bg-[#F4E8FB] text-[#805093]"
                                                }`}
                                        >
                                            {item.status}
                                        </span>


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
