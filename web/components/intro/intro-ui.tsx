"use client"
import react,{useState} from "react"
import {WalletButton} from "@/components/solana/solana-provider"
import {walletKey, getProfile, getpda, deleteProfile, makeProfile, getsols, claimAirdrop} from "./intro-data-access"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"


// the nav component jsx
export const Nav  = ()=>{
    return(
        <div className=" w-full h-[70px] flex justify-between items-center bg-black text-white px-2">
            <h3>DavDapp</h3>
            <WalletButton/> 
        </div>
    )
}
// the hero div
export const Hero = ()=>{
    const {keys} = walletKey()
    return(
        <div className=" w-full flex items-center justify-center text-xl my-3 text-black ">
            {
                keys ? <p>Hello, <span className=" text-purple-700 font-bold">{keys}</span> go ahead and introduce your self please</p>:
                <p>please connect your wallet with the key above🥰🥰</p>
            }
        </div>
    )
}

// the right div with the inputs needed
export const RightDiv = ()=>{
    const[name, setname] = useState<string>("");
    const[about, setabout] = useState<string>("");
    const profile = makeProfile()
    const handleSubmit = ()=>{
        setname("");
        setabout("");
        // here we then make use of react query to submit the form
        profile?.createProfile.mutateAsync({name, desc:about})
    }
    return(
        <div className=" flex-1 flex-col space-y-2 border border-black px-6 py-8 h-[400px]">
            <GetAccounts/>
            <div className="flex flex-col  space-y-2 w-full h-full rounded-md">
                <input value={name} onChange={(e)=>setname(e.target.value)} className=" bg-white border p-2" placeholder="enter name..."/>
                <textarea value={about} onChange={(e)=>setabout(e.target.value)} className="bg-white border p-2 h-[200px]" placeholder="enter desc..."/>
                <button onClick={handleSubmit} className=" flex items-center justify-center py-3 bg-green-600 rounded-md text-white hover:bg-green-800 ease-in-out duration-200">SUBMIT</button>
            </div>
        </div>
    )
}

// the left div appears below, this returns all the introductions so far
export const LeftDiv = ()=>{
    const {profiles} = getProfile()
    return(
        <div className=" flex-1 space-y-2">
            {
                profiles.data && profiles.data.map((item, keys)=>(<EachProfile item={item} key={keys}/>))
            }
        </div>
    )
}

export const EachProfile = (item:any)=>{
    const {keys} = walletKey()
    const {mutation} = deleteProfile()
    const run = getpda()
    const handleDelete = (item_key:string)=>{
      if(item_key.toString() != run?.pda.toString()){
        return alert("you can only delete your post😁😁😁")
      }
    //   then we go ahead and delete 
    mutation.mutateAsync(run.pda)
    }
    return(
        <div className=" bg-slate-200 border border-slate-800 flex flex-col space-y-2 rounded-md p-2">
            <p>{item.item.pubkey}</p>
            <p>{item.item.account.about}</p>
            <div className=" bg-green-200 text-black p-2 rounded-md w-fit"><p>{item.item.account.name}</p></div>
            <div className=" flex items-end justify-end">
            <button className=" bg-red-600 text-white p-1 rounded-sm" onClick={()=>handleDelete(item.item.publicKey)}>delete</button>
            </div>
        </div>
    )
}

// component for airdroping sol and checking sol balance
export const GetAccounts = ()=>{
    const {sols} = getsols()
    const {airdrop} = claimAirdrop()
    const handleClick = ()=>{
        airdrop.mutateAsync()
    }
    return(
        <div className=" flex gap-2 items-center">
            <div>{((sols.data as number)/LAMPORTS_PER_SOL).toFixed(2)}sol</div>
            <button onClick={handleClick} className=" p-2 rounded-md bg-green-600 text-white">claim sol</button>
        </div>
    )
}
