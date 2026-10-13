import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../config';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
// icons
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='bg-transparent flex justify-center px-4 pt-6'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_rgba(82,14,167,0.08)] border border-[#E7D8EA] px-8 py-4 flex justify-between items-center relative'>
            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='bg-gradient-to-r from-[#805093] to-[#520EA7] text-white p-2 rounded-lg shadow-sm'>
                    <BsRobot size={18}/>

                </div>
                <h1 className='font-semibold hidden md:block text-lg text-[#322B3B]'>PrepPilot</h1>
            </div>

            <div className='flex items-center gap-6  relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-[#F4E8FB] text-[#520EA7] px-4 py-2 rounded-full text-md hover:bg-[#EAD5F2] transition'>
                        <BsCoin size={20}/>
                        {userData?.credits || 0}
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-[#E7D8EA] rounded-xl p-5 z-50'>
                            <p className='text-sm text-[#6f567f] mb-4'>Need more credits to continue interviews?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full bg-gradient-to-r from-[#805093] to-[#520EA7] text-white py-2 rounded-lg text-sm'>Buy more credits</button>

                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{
                         if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                    }} className='w-9 h-9 bg-gradient-to-r from-[#805093] to-[#520EA7] text-white rounded-full flex items-center justify-center font-semibold shadow-sm'>
                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>}
                        
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-[#E7D8EA] rounded-xl p-4 z-50'>
                            <button onClick={()=>{ navigate('/profile'); setShowUserPopup(false); }} className='w-full text-left text-md text-[#520EA7] font-medium mb-2'>
                                {userData?.name}
                            </button>

                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 hover:text-[#520EA7] text-[#6f567f]'>InterView History</button>
                            <button onClick={handleLogout} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-[#805093]'>
                                <HiOutlineLogout size={16}/>
                                Logout</button>
                        </div>
                    )}
                </div>

            </div>



        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
      
    </div>
  )
}

export default Navbar
