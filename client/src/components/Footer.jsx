import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-transparent flex justify-center px-4 pb-10 py-4 pt-10'>
      <div className='w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_rgba(82,14,167,0.08)] border border-[#E7D8EA] py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
            <div className='bg-gradient-to-r from-[#805093] to-[#520EA7] text-white p-2 rounded-lg shadow-sm'><BsRobot size={16}/></div>
            <h2 className='font-semibold text-[#322B3B]'>PrepPilot</h2>
        </div>
        <p className='text-[#6f567f] text-sm max-w-xl mx-auto'>
  AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>


      </div>
    </div>
  )
}

export default Footer
