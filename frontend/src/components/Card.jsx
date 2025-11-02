import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({image}) {
      const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`group relative flex h-[160px] w-[110px] items-center justify-center overflow-hidden rounded-[26px] border border-white/15 bg-white/10 shadow-[0_20px_55px_rgba(6,15,60,0.55)] transition duration-300 hover:-translate-y-[6px] hover:border-[#60a5fa] hover:shadow-[0_26px_75px_rgba(30,64,175,0.65)] lg:h-[260px] lg:w-[170px] ${selectedImage==image?"border-[#60a5fa] ring-2 ring-offset-2 ring-offset-[#020221] shadow-[0_30px_80px_rgba(56,189,248,0.55)]":""}`} onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
        }}>
      <img src={image} className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]'  />
    </div>
  )
}

export default Card
