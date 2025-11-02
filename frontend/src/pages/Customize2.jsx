import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant=async ()=>{
        setLoading(true)
        try {
            let formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                 formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden px-[22px] py-[100px]'>
      <div className='absolute inset-0 bg-gradient-to-br from-[#050214] via-[#0a0a3d] to-[#020111]' />
      <div className='absolute left-[12%] top-[18%] h-[320px] w-[320px] rounded-full bg-[#22d3ee]/35 blur-3xl' />
      <div className='absolute right-[10%] bottom-[16%] h-[360px] w-[360px] rounded-full bg-[#a855f7]/30 blur-3xl' />
      <div className='relative z-10 w-full max-w-[640px] rounded-[36px] border border-white/10 bg-white/5 p-[42px] backdrop-blur-3xl shadow-[0_35px_90px_rgba(4,8,35,0.55)]'>
        <div className='flex items-center justify-between'>
          <MdKeyboardBackspace className='h-[42px] w-[42px] cursor-pointer rounded-full border border-white/15 bg-white/10 p-[10px] text-white/80 transition hover:-translate-x-[4px] hover:bg-white/20 hover:text-white' onClick={()=>navigate("/customize")}/>
        </div>
        <div className='mt-[24px] flex flex-col gap-[18px] text-center'>
          <h1 className='text-[36px] font-semibold text-white md:text-[42px]'>Name your <span className='bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent'>Virtual Assistant</span></h1>
          <p className='text-[17px] text-white/70'>Give your assistant a memorable name to personalize every interaction and make conversations feel natural.</p>
        </div>
        <div className='mt-[36px] flex flex-col items-center gap-[20px]'>
          <input type="text" placeholder='e.g. Shifra' className='h-[62px] w-full rounded-full border border-white/10 bg-white/10 px-[26px] text-[18px] text-white placeholder-white/60 transition focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/40' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
          {assistantName &&  <button className='h-[64px] w-full rounded-full bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] text-[18px] font-semibold text-white shadow-[0_24px_60px_rgba(129,140,248,0.45)] transition hover:-translate-y-[2px] hover:shadow-[0_30px_70px_rgba(129,140,248,0.6)] disabled:cursor-not-allowed disabled:opacity-60' disabled={loading} onClick={()=>{
        handleUpdateAssistant()
    }
        } >{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
        </div>
      </div>
    </div>
  )
}

export default Customize2