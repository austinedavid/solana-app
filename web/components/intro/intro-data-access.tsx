import {useConnection, useWallet} from "@solana/wallet-adapter-react"
import {useQuery, useMutation} from "@tanstack/react-query"
import {useAnchorProvider} from "@/components/solana/solana-provider"
import idl from "@/utils/idl.json"
import {Program, web3, ProgramAccount, utils } from "@coral-xyz/anchor"
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"
import {useTransactionToast} from "../ui/ui-layout"

export const walletKey = ()=>{
    // get the public key in the base58
    const wallet = useWallet();
    const keys = wallet.publicKey?.toBase58();
    return {keys}
}
export const getpda = ()=>{
    const programId = new web3.PublicKey("CNnMVkasDh1Eq1ESnZRmciXeVRnFTU6mpJ9vPYF3Bd6m");
    const wallet = useWallet()
    const provider = useAnchorProvider()
   if(!provider.publicKey) return
    // get the program derived address for the user post
    const [pda] =  web3.PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("student"), provider.publicKey?.toBuffer()], programId)
    return{pda}
    
}
// below we get the program for interacting with our app
const getProgram = ():Program=>{
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);
    const provider = useAnchorProvider();
    const programId = new web3.PublicKey("CNnMVkasDh1Eq1ESnZRmciXeVRnFTU6mpJ9vPYF3Bd6m");
    // get program now
    const program = new Program(b, programId, provider)
    return program
}
export const getProfile = ()=>{
    const program = getProgram();
    const profiles = useQuery({
        queryKey: ["profiles"],
        queryFn: async()=> program.account.student.all()
    })
    return{profiles}
}

export const makeProfile = ()=>{
    const provider = useAnchorProvider();
    const program = getProgram()
    const {profiles} = getProfile()
    const programId = new web3.PublicKey("CNnMVkasDh1Eq1ESnZRmciXeVRnFTU6mpJ9vPYF3Bd6m");
    const toast = useTransactionToast()
   
    // here we handle the creation function 
    const createProfile = useMutation({
        mutationKey: ["profiles"],
        mutationFn: async(input:{name:string, desc:string})=>{
            const [pda] =  web3.PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("student"), provider.publicKey?.toBuffer()], programId)
            const tx =  await program.methods
                        .create(input.name, input.desc)
                        .accounts({
                            signer:provider.publicKey,
                            studentAccount:pda,
                            systemProgram:web3.SystemProgram.programId
                        })
                        .rpc()
            return tx
        },
        onSuccess:(tx)=>{
            toast(tx)
            profiles.refetch()
        }
    })

    return {createProfile}
}

export const deleteProfile = ()=>{
    const provider = useAnchorProvider()
    const program = getProgram()
    const {profiles} = getProfile()
    const toast = useTransactionToast()
    const mutation = useMutation({
        mutationKey:["profiles"],
        mutationFn: async(pda:PublicKey)=>{
            const tx = await program.methods
                    .delete()
                    .accounts({
                        signer:provider.publicKey,
                        studentAccount:pda,
                        systemProgram:web3.SystemProgram.programId
                    })
                    .rpc()
            return tx
        },
        onSuccess:(tx)=>{
            toast(tx)
            profiles.refetch()
        },

    })
    return{mutation}
}
// here we the amount of sols present in the wallet
export const getsols = ()=>{
    const wallet = useWallet();
    const {connection} = useConnection()
    const sols = useQuery({
        queryKey:["amt", {address:wallet.publicKey}],
        queryFn:()=> connection.getBalance(wallet.publicKey!)
    })
    return{sols}
}
// this function is to claim airdrop
export const claimAirdrop = ()=>{
    const wallet = useWallet();
    const toast = useTransactionToast()
    const {connection} = useConnection()
    const {sols} = getsols()
    const airdrop = useMutation({
        mutationKey:["amt"],
        mutationFn:async()=>{
            const tx = await connection.requestAirdrop(wallet.publicKey!, LAMPORTS_PER_SOL*2)
            return tx
        },
        onSuccess:(tx)=>{
            toast(tx)
            sols.refetch()
        }
    })
    return{airdrop}
}