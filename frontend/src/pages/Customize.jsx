import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.png"
import image7 from "../assets/image7.png"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
function Customize() {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate=useNavigate()
     const inputImage=useRef()

     const handleImage=(e)=>{
const file=e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
     }
  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden px-[18px] py-[90px]'>
      <div className='absolute inset-0 bg-gradient-to-br from-[#040214] via-[#07063c] to-[#020112]' />
      <div className='absolute -left-[12%] top-[12%] h-[320px] w-[320px] rounded-full bg-[#4f46e5]/35 blur-3xl' />
      <div className='absolute right-[8%] bottom-[8%] h-[360px] w-[360px] rounded-full bg-[#38bdf8]/30 blur-3xl' />
      <div className='absolute left-1/2 top-[65%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f97316]/10 blur-[180px]' />
      <div className='relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-[32px]'>
        <div className='flex w-full items-center justify-between gap-[12px]'>
          <MdKeyboardBackspace className='h-[42px] w-[42px] cursor-pointer rounded-full border border-white/15 bg-white/10 p-[10px] text-white/80 transition hover:-translate-x-[4px] hover:bg-white/20 hover:text-white' onClick={()=>navigate("/")}/>
          {selectedImage && <button className='hidden rounded-full bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] px-[34px] py-[14px] text-[16px] font-semibold text-white shadow-[0_18px_45px_rgba(129,140,248,0.4)] transition hover:-translate-y-[2px] hover:shadow-[0_26px_55px_rgba(129,140,248,0.55)] lg:inline-flex' onClick={()=>navigate("/customize2")}>Next</button>}
        </div>
        <div className='flex w-full flex-col items-center gap-[14px] text-center'>
          <h1 className='text-[36px] font-semibold text-white md:text-[42px]'>Select your <span className='bg-gradient-to-r from-[#38bdf8] via-[#8b5cf6] to-[#f472b6] bg-clip-text text-transparent'>Assistant Image</span></h1>
          <p className='max-w-[620px] text-[16px] text-white/70 md:text-[18px]'>Choose a signature look for your AI companion or upload a unique portrait to give your assistant a personal touch.</p>
        </div>
        <div className='grid w-full gap-[22px] rounded-[36px] border border-white/10 bg-white/5 p-[28px] backdrop-blur-3xl shadow-[0_35px_90px_rgba(4,8,35,0.55)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          <div className='flex items-center justify-center'><Card image={image1}/></div>
          <div className='flex items-center justify-center'><Card image={image2}/></div>
          <div className='flex items-center justify-center'><Card image={image3}/></div>
          <div className='flex items-center justify-center'><Card image={image4}/></div>
          <div className='flex items-center justify-center'><Card image={image5}/></div>
          <div className='flex items-center justify-center'><Card image={image6}/></div>
          <div className='flex items-center justify-center'><Card image={image7}/></div>
          <div className='flex items-center justify-center'>
            <div className={`group relative flex h-[160px] w-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-white/25 bg-white/5 shadow-[0_20px_55px_rgba(6,15,60,0.4)] transition duration-300 hover:-translate-y-[6px] hover:border-[#22d3ee] hover:bg-white/10 hover:shadow-[0_26px_75px_rgba(30,64,175,0.55)] lg:h-[260px] lg:w-[170px] ${selectedImage=="input"?"border-[#22d3ee] bg-white/10 ring-2 ring-offset-2 ring-offset-[#020221] shadow-[0_30px_80px_rgba(56,189,248,0.55)]":""}`} onClick={()=>{
              inputImage.current.click()
              setSelectedImage("input")
            }}>
              {!frontendImage &&  <RiImageAddLine className='h-[32px] w-[32px] text-white/75 transition group-hover:text-white'/>}
              {frontendImage && <img src={frontendImage} className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]'/>}
            </div>
          </div>
          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        </div>
        {selectedImage && <button className='inline-flex rounded-full bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] px-[38px] py-[16px] text-[17px] font-semibold text-white shadow-[0_20px_55px_rgba(129,140,248,0.4)] transition hover:-translate-y-[2px] hover:shadow-[0_26px_65px_rgba(129,140,248,0.55)] lg:hidden' onClick={()=>navigate("/customize2")}>Next</button>}
      </div>
    </div>
  )
}

export default Customize
