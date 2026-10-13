import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../config';
import Step3Report from '../components/Step3Report';
function InterviewReport() {
  const {id} = useParams()
  const [report,setReport] = useState(null);
   
  useEffect(()=>{
    const fetchReport = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/interview/report/" + id , {withCredentials:true})

        console.log(result.data)
        setReport(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReport()
  },[])


    if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f8effa_0%,_#f4ebf7_50%,_#efe6f2_100%)]">
        <p className="text-[#6f567f] text-lg">
          Loading Report...
        </p>
      </div>
    );
  }

  return <Step3Report report={report}/>
}

export default InterviewReport
