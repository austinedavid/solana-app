"use client"
import {useState, Dispatch, SetStateAction, useRef, useEffect} from "react"
import {createQR} from "@solana/pay"


export const Button = ()=>{
    const[ql, setql] = useState<boolean>(false)
    return ql?(
        <Qrcode setql={setql}/>
        ):
        (
        <Dbutton setql={setql}/>
        )
}
interface Iset{
    setql: Dispatch<SetStateAction<boolean>>
}
export const Dbutton = ({setql}:Iset)=>{
    const handleOpen = ()=>{
        setql(true)
    }
    return(
        <div className=" w-full h-full flex items-center justify-center">
            <button className=" bg-purple-900 rounded-md p-4 hover:bg-purple-800 transition ease-in-out duration-200 text-white font-bold" onClick={handleOpen}>generate payment</button>
        </div>
    )
}

export const Qrcode = ({setql}:Iset)=>{
    const qrRef = useRef<HTMLDivElement>(null)
    const url = "solana:https://solana-app-nine.vercel.app/api/pay"
    // create a useeffect to handle the uploading of the qrcode
    useEffect(()=>{
        const q = createQR(url,300, 'white', 'black')
        if(qrRef.current){
            qrRef.current.innerHTML = "";
            q.append(qrRef.current)
        }
    },[])
    return(
        <div className=" w-full h-full flex  items-center justify-center">
            <div className=" flex flex-col gap-2 items-center">
                {/* below div will display the qrcode to the frontend */}
                <div ref={qrRef}/>
                <div className=" hover:cursor-pointer p-2 bg-white text-black rounded-md" onClick={()=>setql(false)}><p>I have made payments</p></div>
            </div>
        </div>
    )
}