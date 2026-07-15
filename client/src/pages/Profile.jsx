import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Profile() {
  const { userData } = useSelector((state) => state.user)

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8effa_0%,_#f4ebf7_50%,_#efe6f2_100%)] text-[#322B3B] flex flex-col'>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white/95 border border-[#E7D8EA] rounded-3xl p-8 shadow-[0_16px_45px_rgba(82,14,167,0.08)]'>
            <h2 className='text-2xl font-semibold mb-4'>Profile</h2>

            {!userData ? (
              <p className='text-[#6f567f]'>No user data available.</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <p className='text-sm text-[#805093]'>Name</p>
                  <p className='font-medium text-[#322B3B] text-lg'>{userData.name}</p>

                  <p className='text-sm text-[#805093] mt-4'>Email</p>
                  <p className='text-[#322B3B]'>{userData.email}</p>

                  <p className='text-sm text-[#805093] mt-4'>Credits</p>
                  <p className='text-[#520EA7] font-semibold'>{userData.credits || 0}</p>
                </div>

                <div>
                  <h3 className='text-sm text-[#805093] mb-2'>About</h3>
                  <p className='text-[#6f567f]'>This is your PrepPilot profile. You can view your interview history, track progress, and manage account settings from here.</p>

                  <div className='mt-6'>
                    <button onClick={() => window.location.href = '/history'} className='bg-gradient-to-r from-[#805093] to-[#520EA7] text-white px-4 py-2 rounded-lg'>View Interview History</button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default Profile
