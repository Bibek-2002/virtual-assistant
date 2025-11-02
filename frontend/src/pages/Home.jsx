import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"
function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error);
      }
    }
  }
  }

  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices =window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }


    isSpeakingRef.current=true
    utterence.onend=()=>{
        setAiText("");
  isSpeakingRef.current = false;
  setTimeout(() => {
    startRecognition();
  }, 800);
    }
   synth.cancel();
synth.speak(utterence);
  }

  const handleCommand=(data)=>{
    const {type,userInput,response}=data
      speak(response);
    
    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator-open') {
  
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

  let isMounted = true;

  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      const data = await getGeminiResponse(transcript);
      handleCommand(data);
      setAiText(data.response);
      setUserText("");
    }
  };


    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
   
    window.speechSynthesis.speak(greeting);
 

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);

  const statusText = listening ? "Listening..." : aiText ? "Responding..." : "Ready";
  const statusTone = listening ? "bg-emerald-400/15 text-emerald-200 border border-emerald-400/40" : aiText ? "bg-sky-400/15 text-sky-200 border border-sky-400/40" : "bg-white/10 text-white/70 border border-white/10";
  const tipAssistantName = userData?.assistantName || "your assistant";
  const messageDisplay = userText ? userText : aiText ? aiText : `Say "${tipAssistantName}" to begin a conversation.`;
  const messageLabel = userText ? "Recognized Speech" : aiText ? "Assistant Response" : "Getting Started";
  const activeGif = aiText ? aiImg : userImg;

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden px-[18px] py-[80px]'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1f4d_0%,rgba(3,2,35,0.85)_38%,rgba(2,1,20,0.92)_100%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.18),transparent_60%)]' />
      <div className='absolute -left-[18%] top-[15%] h-[360px] w-[360px] rounded-full bg-[#4f46e5]/35 blur-3xl' />
      <div className='absolute right-[10%] bottom-[12%] h-[420px] w-[420px] rounded-full bg-[#ec4899]/20 blur-[220px]' />
      <CgMenuRight className='absolute right-[22px] top-[26px] h-[32px] w-[32px] cursor-pointer text-white/80 transition hover:text-white lg:hidden' onClick={()=>setHam(true)}/>
      <div className={`fixed inset-0 z-40 flex justify-end lg:hidden transition-all duration-500 ${ham?"translate-x-0 opacity-100":"translate-x-full opacity-0"}`}>
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={()=>setHam(false)}></div>
        <div className='relative z-10 flex h-full w-[88%] max-w-[320px] flex-col gap-[24px] rounded-l-[32px] border border-white/10 bg-[#070729]/95 p-[26px] text-white shadow-[0_30px_90px_rgba(4,8,35,0.65)]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[20px] font-semibold text-white/85'>Quick Menu</h2>
            <RxCross1 className='h-[26px] w-[26px] cursor-pointer text-white/60 hover:text-white' onClick={()=>setHam(false)}/>
          </div>
          <button className='h-[56px] w-full rounded-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#60a5fa] text-[17px] font-semibold text-white shadow-[0_18px_50px_rgba(132,105,245,0.45)] transition hover:-translate-y-[2px]' onClick={()=>{
            setHam(false)
            handleLogOut()
          }}>Log Out</button>
          <button className='h-[56px] w-full rounded-full border border-white/15 bg-white/10 text-[17px] font-semibold text-white transition hover:-translate-y-[2px] hover:border-[#60a5fa] hover:bg-white/15' onClick={()=>{
            setHam(false)
            navigate("/customize")
          }}>Customize Assistant</button>
          <div className='h-[1px] w-full bg-white/10'></div>
          <h3 className='text-[18px] font-semibold text-white'>Recent History</h3>
          <div className='flex-1 space-y-[14px] overflow-y-auto pr-[4px]'>
            {userData.history?.length ? userData.history.map((his,index)=>(
              <div key={index} className='rounded-[18px] border border-white/10 bg-white/8 px-[16px] py-[12px] text-[15px] text-white/70'>{his}</div>
            )) : <p className='text-[15px] text-white/55'>No voice interactions yet.</p>}
          </div>
        </div>
      </div>
      <div className='relative z-20 flex w-full max-w-[1200px] flex-col gap-[36px]'>
        <div className='flex flex-wrap items-center justify-between gap-[18px] text-white'>
          <div className='flex flex-col gap-[6px]'>
            <span className='text-[15px] uppercase tracking-[0.28em] text-white/50'>Virtual Assistant</span>
            <h1 className='text-[34px] font-semibold leading-tight md:text-[40px]'>Hello {userData?.name}, welcome back.</h1>
            <p className='text-[16px] text-white/60 md:text-[18px]'>Manage conversations, personalize your AI, and pick up where you left off.</p>
          </div>
          <div className='hidden items-center gap-[14px] lg:flex'>
            <button className='h-[56px] rounded-full border border-white/15 bg-white/10 px-[26px] text-[16px] font-semibold text-white transition hover:-translate-y-[2px] hover:border-[#60a5fa] hover:bg-white/15' onClick={()=>navigate("/customize")}>Customize Assistant</button>
            <button className='h-[56px] rounded-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#60a5fa] px-[26px] text-[16px] font-semibold text-white shadow-[0_18px_60px_rgba(132,105,245,0.45)] transition hover:-translate-y-[2px]' onClick={handleLogOut}>Log Out</button>
          </div>
        </div>
        <div className='grid gap-[26px] lg:grid-cols-[1.45fr_1fr]'>
          <div className='flex flex-col gap-[26px]'>
            <div className='rounded-[36px] border border-white/10 bg-white/6 p-[32px] backdrop-blur-3xl shadow-[0_40px_100px_rgba(5,10,40,0.55)]'>
              <div className='flex flex-wrap items-center justify-between gap-[16px]'>
                <div className='flex items-center gap-[12px]'>
                  <span className='rounded-full bg-white/10 px-[16px] py-[8px] text-[15px] font-medium text-white/70'>Status</span>
                  <span className={`rounded-full px-[16px] py-[8px] text-[15px] font-medium transition ${statusTone}`}>{statusText}</span>
                </div>
                <button className='rounded-full border border-white/15 bg-white/10 px-[22px] py-[10px] text-[15px] font-semibold text-white transition hover:-translate-y-[2px] hover:border-[#38bdf8] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70' onClick={startRecognition} disabled={listening}>Trigger Listening</button>
              </div>
              <div className='mt-[28px] flex flex-wrap items-center justify-between gap-[24px]'>
                <div className='relative flex flex-1 flex-col gap-[18px]'>
                  <h2 className='text-[28px] font-semibold text-white md:text-[32px]'>I'm {userData?.assistantName}</h2>
                  <div className='rounded-[28px] border border-white/10 bg-white/10 p-[24px] text-white/80 shadow-[0_25px_70px_rgba(5,12,50,0.45)]'>
                    <span className='text-[14px] uppercase tracking-[0.22em] text-white/50'>{messageLabel}</span>
                    <p className='mt-[12px] text-[18px] leading-[1.6] text-white/90'>{messageDisplay}</p>
                  </div>
                </div>
                <div className='relative flex flex-col items-center gap-[16px]'>
                  <div className='relative h-[220px] w-[220px] overflow-hidden rounded-[32px] border border-white/10 bg-black/40 shadow-[0_30px_90px_rgba(6,15,60,0.55)]'>
                    <img src={userData?.assistantImage} alt='assistant' className='h-full w-full object-cover'/>
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                  </div>
                  <img src={activeGif} alt='voice-state' className='w-[140px]' />
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-[26px]'>
            <div className='rounded-[32px] border border-white/10 bg-white/6 p-[26px] backdrop-blur-3xl shadow-[0_35px_90px_rgba(5,10,40,0.55)]'>
              <h2 className='text-[22px] font-semibold text-white'>Session Overview</h2>
              <p className='mt-[10px] text-[15px] text-white/60'>Voice interactions appear here so you can revisit earlier prompts.</p>
              <div className='mt-[22px] flex max-h-[320px] flex-col gap-[16px] overflow-y-auto pr-[4px]'>
                {userData.history?.length ? userData.history.map((his,index)=>(
                  <div key={index} className='rounded-[22px] border border-white/10 bg-white/10 px-[18px] py-[16px] text-[15px] text-white/75'>{his}</div>
                )) : <p className='text-[15px] text-white/55'>Your conversation history will show up here once you start talking.</p>}
              </div>
            </div>
            <div className='rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1f2937]/70 via-[#111827]/60 to-[#0f172a]/80 p-[26px] shadow-[0_35px_90px_rgba(8,12,45,0.55)] text-white/80'>
              <h3 className='text-[20px] font-semibold text-white'>Tips</h3>
              <ul className='mt-[16px] space-y-[12px] text-[15px]'>
                <li className='rounded-[18px] border border-white/10 bg-white/5 px-[16px] py-[12px]'>Ask for quick searches, weather updates, or even entertainment, all hands-free.</li>
                <li className='rounded-[18px] border border-white/10 bg-white/5 px-[16px] py-[12px]'>Use the customize panel to refresh {tipAssistantName}'s appearance and voice greeting.</li>
                <li className='rounded-[18px] border border-white/10 bg-white/5 px-[16px] py-[12px]'>Open apps like YouTube, Instagram, or calculator instantly with simple voice commands.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home