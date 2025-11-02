import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"
function SignUp() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
const [err,setErr]=useState("")
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
try {
  let result=await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password
  },{withCredentials:true} )
 setUserData(result.data)
  setLoading(false)
  navigate("/customize")
} catch (error) {
  console.log(error)
  setUserData(null)
  setLoading(false)
  setErr(error.response.data.message)
}
    }
  return (
    <div className='relative flex w-full min-h-screen items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 bg-cover bg-center opacity-80' style={{ backgroundImage: `url(${bg})` }} />
      <div className='absolute inset-0 bg-gradient-to-b from-black/85 via-[#020222]/70 to-black/85' />
      <div className='absolute -left-32 top-[35%] h-[260px] w-[260px] rounded-full bg-[#1d4ed8]/30 blur-3xl' />
      <div className='absolute -right-36 -top-24 h-[320px] w-[320px] rounded-full bg-[#34d399]/25 blur-3xl' />
      <form className='relative z-10 flex w-[90%] max-w-[440px] flex-col items-center gap-[20px] rounded-[32px] border border-white/15 bg-white/10 p-[40px] backdrop-blur-3xl shadow-[0_35px_90px_rgba(5,11,35,0.55)]' onSubmit={handleSignUp}>
        <h1 className='text-center text-[34px] font-semibold text-white'>Create Account<span className='block text-[22px] font-medium text-[#a5f3fc]'>Virtual Assistant</span></h1>
        <input type="text" placeholder='Full name' className='h-[58px] w-full rounded-full border border-white/10 bg-white/10 px-[24px] text-[18px] text-white placeholder-white/60 transition focus:border-[#34d399] focus:outline-none focus:ring-2 focus:ring-[#34d399]/40' required onChange={(e)=>setName(e.target.value)} value={name}/>
        <input type="email" placeholder='Email address' className='h-[58px] w-full rounded-full border border-white/10 bg-white/10 px-[24px] text-[18px] text-white placeholder-white/60 transition focus:border-[#34d399] focus:outline-none focus:ring-2 focus:ring-[#34d399]/40' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <div className='relative h-[58px] w-full rounded-full border border-white/10 bg-white/10 px-[24px] text-[18px] text-white transition focus-within:border-[#34d399] focus-within:ring-2 focus-within:ring-[#34d399]/40'>
          <input type={showPassword?"text":"password"} placeholder='Password' className='h-full w-full bg-transparent pr-[54px] text-white placeholder-white/60 focus:outline-none' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
          {!showPassword && <IoEye className='absolute top-1/2 right-[20px] h-[26px] w-[26px] -translate-y-1/2 cursor-pointer text-white/80 hover:text-white' onClick={()=>setShowPassword(true)}/>}
          {showPassword && <IoEyeOff className='absolute top-1/2 right-[20px] h-[26px] w-[26px] -translate-y-1/2 cursor-pointer text-white/80 hover:text-white' onClick={()=>setShowPassword(false)}/>}
        </div>
        {err.length>0 && <p className='w-full text-left text-[16px] font-medium text-red-400'>*{err}</p>}
        <button className='mt-[10px] h-[60px] w-full rounded-full bg-gradient-to-r from-[#34d399] via-[#22d3ee] to-[#6366f1] text-[18px] font-semibold text-white shadow-[0_18px_45px_rgba(34,211,238,0.35)] transition hover:-translate-y-[2px] hover:shadow-[0_24px_55px_rgba(56,189,248,0.45)] disabled:cursor-not-allowed disabled:opacity-60' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>
        <p className='text-center text-[16px] text-white/70'>Already have an account? <span className='cursor-pointer font-semibold text-[#a5f3fc] hover:text-white' onClick={()=>navigate("/signin")}>Sign In</span></p>
      </form>
    </div>
  )
}

export default SignUp
