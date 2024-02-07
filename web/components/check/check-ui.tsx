"use client"
import {getStudentProfile, useCounter, useBlockDetails, useTransaction} from "./check-data-access"
import {useAnchorProvider} from "@/components/solana/solana-provider"
import {web3, Program, utils, Wallet} from "@coral-xyz/anchor"
import { useMemo, useEffect, useState, useCallback} from "react"
import {useWallet, useConnection} from "@solana/wallet-adapter-react"
import idl from "@/utils/idl.json"
import {WalletButton} from "@/components/solana/solana-provider"
import * as token from "@solana/spl-token"
import {SystemInstruction, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js"
import toast,{Toaster} from "react-hot-toast"


export const SubmittedIntro = ()=>{
    const {createStudent, deleteStudent, getfile, provider} = getStudentProfile()
    const decimal = 9;
    const {connection} = useConnection()
    const keypair = web3.Keypair.generate();
    const programId = token.TOKEN_PROGRAM_ID;
    const {publicKey, sendTransaction} = useWallet()
    const[blocks, setblocks] = useState<{blockhash: string;lastValidBlockHeight: number;}>();
    const[solbal, setsolbal] = useState<number>();
    const[receiver, setreciever] = useState<string>()
    const[amt, setamt] = useState<number>()
    // const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const davToken = new web3.PublicKey("6QGKcYbGBompTSQHNMb6c3n1G6kTNJxtxpEQ66xiHS1V");
    const {balanceQuery, balanceQuery1, getDetails} = useBlockDetails({address:provider.wallet.publicKey, connection:connection})
    const{sendSol, getTokens} = useTransaction()
   
     // lets create a program below here
    
    const handleButton = async()=>{
        createStudent.mutateAsync()
    }

    const handleDelete = ()=>{
        deleteStudent.mutateAsync()
    }
    // to create mint account below
    const createMint = async()=>{
      console.log(keypair.publicKey.toBase58())
      const lamports = await token.getMinimumBalanceForRentExemptAccount(connection)
      console.log(lamports)
      try {
          // here we create an account for the token
      // using the the token program as the owner of the address
      
      // lets create a new instance of transaction 
      // then compile the both and send it out
      const transaction =  new web3.Transaction();
      transaction.add(
        web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey:keypair.publicKey,
          space: token.MINT_SIZE,
          lamports,
          programId
        }),
        // this transaction will help to initilize 
        // some of the needed data in the token mint account
        token.createInitializeMintInstruction(
          keypair.publicKey,
          decimal,
          provider.wallet.publicKey,
          provider.wallet.publicKey,
        )
      )
      console.log("reached here")
      const sentTransaction = await sendTransaction(transaction, connection);
      console.log(sentTransaction)
      } catch (error) {
      console.log(error)
      }
    }
   const handle = async()=>{
    
   }
   const getAta = async()=>{
    try {
      const myAta = await token.createAssociatedTokenAccount(
        connection,
        keypair,
        davToken,
        keypair.publicKey,
      )
      console.log(myAta)
    } catch (error) {
      console.log(error)
    }
   }
  //  get the last blockhash
  const blockHash = async()=>{
    const block = await connection.getLatestBlockhash()
    setblocks(block)
    const balance = await connection.getBalance(provider.wallet.publicKey)
    const sols = balance/LAMPORTS_PER_SOL;
    setsolbal(sols)
  }
  // handle revalidate here 
  const handleRevalidate = ()=>{
    balanceQuery1.refetch()
  }
  // lets handle transfer here
  const transferNow = async()=>{
    const pubreceiver = new web3.PublicKey(receiver as string);
    sendSol.mutateAsync({reciever:pubreceiver, amt:amt as number})
  }
  return(
    <div>
    <div className=" flex gap-2">
        <WalletButton/>
        <button onClick={handleButton} className=" bg-green-800 text-white p-2 rounded-md">Create me</button>
        <button onClick={handleDelete} className=" bg-red-700 text-white p-2 rounded-md">Delete me</button>
        <button onClick={createMint}>Create Mint Account</button>
        <button onClick={handle}>show mint</button>
        <button onClick={getAta} className=" border  border-solid p-2">create ATA</button>
        <button onClick={blockHash} className=" bg-yellow-500 p-2 rounded-md text-black">last blockhash</button>
    </div>
    <div>
      <p>below here</p>
      {
        blocks && (<div><p className=" text-green-500">{blocks.blockhash}</p><p>{blocks.lastValidBlockHeight}</p></div>)
      }
      {
        solbal && (<div><p className=" text-green-500">{solbal.toFixed(2)}</p></div>)
      }
      {
        balanceQuery.data && (<p className="text-red-500">{(balanceQuery?.data/LAMPORTS_PER_SOL).toFixed(4)}</p>)
      }
      {
        balanceQuery1.data && (<p>{(balanceQuery1?.data/LAMPORTS_PER_SOL).toFixed(4)}</p>)
      }
      {
        getDetails.data && getDetails.data.map((item)=><div className=" flex gap-2" key={item.signature}><p>{item.blockTime}</p><p>{item.signature}</p></div>)
      }
    </div>
    <div>
      <button onClick={handleRevalidate}>REVALIDATE QUERY</button>
    </div>
    <div className=" w-[200px] h-[200px] rounded-md  bg-slate-400 flex flex-col space-y-3 ">
      <input onChange={(e)=>setreciever(e.target.value)} className=" w-full p-2"/>
      <input type="number" onChange={(e)=>setamt(Number(e.target.value))} className=" w-full p-2"/>
      <button onClick={transferNow} className=" bg-green-500 text-white w-full rounded-md">SEND</button>
    </div>
    {
      getTokens.data? (<div><p>{getTokens.data.context.slot}</p><p>{getTokens.data.value.toString()}</p></div>):(<p className=" text-red-800 font-bold">you have no token</p>)
    }
    <Toaster position="bottom-right"/>
    </div>
  )
}

export const Refmain = ()=>{
    const {getfile} = getStudentProfile()
    console.log(getfile.data)
    return(
        <div>
        
        </div>
    )
}
