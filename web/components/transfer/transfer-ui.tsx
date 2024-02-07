import React,{useEffect, useState} from 'react'
import {useTransfer} from "./transafer-data-access"
import {LAMPORTS_PER_SOL} from "@solana/web3.js"
import {web3, Program} from "@coral-xyz/anchor"
import idl from "@/utils/idl.json";
import { useAnchorProvider } from '../solana/solana-provider';

export const TransferUi = () => {
  const provider = useAnchorProvider()
  const{tokenDetails} = useTransfer()
  const programId = new web3.PublicKey("CNnMVkasDh1Eq1ESnZRmciXeVRnFTU6mpJ9vPYF3Bd6m");
  const a = JSON.stringify(idl);
  const b = JSON.parse(a);
  const[intro, setinto] = useState<any>([]);
  useEffect(()=>{
   function getitems(){
    const program = new Program(b, programId, provider);
    // getching data here
    program.account.student.all()
    .then((item)=>{
      setinto(item)
    })
   
   }
   getitems()
  },[])
  if(tokenDetails.isFetching || tokenDetails.isLoading){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <div>
        {tokenDetails.data && (<div className=' flex flex-col gap-2'>
          <p>TOKEN ADDRESS: {tokenDetails.data.address.toBase58()}</p>
          <p>TOKEN DECIMALS: {tokenDetails.data.decimals}</p>
          <p>Total Supply: {Number(tokenDetails.data.supply)/LAMPORTS_PER_SOL}</p>
        </div>)}
        <div>
          {
            intro.map((items:any, index:any)=>(<EachCard item={items} key={index}/>))
          }
        </div>
    </div>
  )
}

export const GetAta = ()=>{
  const {getAta} = useTransfer()
  const handleAta = ()=>{
    getAta.mutateAsync()
  }
  return(
  <div>
    <button onClick={handleAta} className=' p-2 text-white bg-green-800 rounded-md'>Get Ata</button>
  </div>
  )
}

export const EachCard = (params:any)=>{
 
  return(
    <div>
      <p>Name: {params.item.account.name}</p>
      <p>desc: {params.item.account.about}</p>
    </div>
  )
}