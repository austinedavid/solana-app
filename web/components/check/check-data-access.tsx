"use client"
// here we will make all the logic needed for getting the necessary data
// first, lets fetch the student intro on the on that just logged in now
import {useMutation, useQuery} from "@tanstack/react-query"
import idl from "@/utils/idl.json"
import {useAnchorProvider} from "@/components/solana/solana-provider"
import {useConnection, useWallet} from "@solana/wallet-adapter-react"
import {Program, web3, Idl, utils} from "@coral-xyz/anchor"
import idl2 from "@/utils/idl2.json"
import {PublicKey, Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction} from "@solana/web3.js"
import {useTransactionToast} from "@/components/ui/ui-layout"
import {TOKEN_2022_PROGRAM_ID} from "@solana/spl-token"

interface Iface {
    name:string,
    desc:string
}

export const getStudentProfile = ()=>{
    const programString = "CNnMVkasDh1Eq1ESnZRmciXeVRnFTU6mpJ9vPYF3Bd6m";
    const programId = new web3.PublicKey(programString);
    const provider = useAnchorProvider()
    const {publicKey} = useWallet()
    const a = JSON.stringify(idl)
    const b = JSON.parse(a)
  
    // here we create a new instance of the program here
    const program = new Program(b, programId, provider )
    const getfile = useQuery({
        queryKey:["profile"],
        queryFn: async()=>{
          
        }
    })
    // lets try and create a new student account here
    const createStudent = useMutation({
        mutationKey:["adults", "students"],
        mutationFn: ()=>{
        const [pda] =  web3.PublicKey.findProgramAddressSync([
            utils.bytes.utf8.encode("student"),
            provider.publicKey?.toBuffer()
        ], programId)
        const tx = program.methods.create("johnbull".toString(), "loving student that cares")
        .accounts({
            signer:provider.publicKey,
            studentAccount:pda,
            systemProgram:web3.SystemProgram.programId
        })
        .rpc()
        return tx;
        },
        onSuccess: (tx)=>{
            alert(tx);
            getfile.refetch();
        },
        onError: (error)=>{
            alert(error)
        }
        
    })

    // here we delete a user
    const deleteStudent = useMutation({
        mutationKey:["adults", "students"],
        mutationFn: ()=>{
        const [pda] =  web3.PublicKey.findProgramAddressSync([
            utils.bytes.utf8.encode("student"),
            provider.publicKey?.toBuffer()
        ], programId)
        const tx = program.methods.delete()
        .accounts({
            signer:provider.publicKey,
            studentAccount:pda,
            systemProgram:web3.SystemProgram.programId
        })
        .rpc()
        return tx;
        },
        onSuccess: (tx)=>{
            alert(tx)
        },
        onError: (error)=>{
            alert(error)
        }
        
    })
    // all necessary return now
    return{getfile, createStudent, deleteStudent, provider}
}

// lets get the information on the second idl
export const useCounter = ()=>{
    const countId = "H2y41fgUYkSXrBvNkXArhtcpurAHDpuFbuR1YGAEawei";
    const programId = new web3.PublicKey(countId);
    const provider = useAnchorProvider();
    const countPub = new web3.PublicKey("8FmqjU91iQGP3wb5hwHy5KwGCsSqKjvnNzyDdLGX1VwY")

    // generating the program needed to run the code
    const program = new Program(idl2 as Idl, programId, provider)

    // making a query to return all the counts here
    const allCounts = useQuery({
        queryKey: ["theking"],
        queryFn: async()=>{
            await fetch("https://jsonplaceholder.typicode.com/users")
            .then((item)=>{
                let all:Promise<Iface[]> = item.json()
                return all
            })
        }
    })

    return {allCounts}

}

// lets get the informations from the blockchain here
export const useBlockDetails = ({address, connection}:{address:PublicKey, connection:Connection})=>{
    const balanceQuery = useQuery({
        queryKey:["first-key",{address}],
        queryFn:()=>{
            const value = connection.getBalance(address);
            return value
        }
    })
    const balanceQuery1 = useQuery({
        queryKey:["first-key"],
        queryFn:()=>{
            const value = connection.getBalance(address);
            return value
        }
    })
    // get the confirmed signatures needed for each accounts
    const getDetails = useQuery({
        queryKey:["key",{address}],
        queryFn: ()=>{
            const value = connection.getConfirmedSignaturesForAddress2(address);
            return value
        }
    })
    return {balanceQuery, balanceQuery1, getDetails}
}

// send sol to someone from your wallet 
export const useTransaction = ()=>{
    const provider = useAnchorProvider()
    const toast = useTransactionToast()
    const {connection} = useConnection()
    const{balanceQuery, balanceQuery1} = useBlockDetails({address:provider.wallet.publicKey, connection:connection})
    const wallet = useWallet()
    const sendSol = useMutation({
        mutationKey:["mutate"],
        mutationFn:async(items:{reciever:PublicKey, amt:number})=>{
            // lets get the instruction for the transaction first
            const instruction = SystemProgram.transfer({
                fromPubkey: provider.wallet.publicKey,
                toPubkey:items.reciever,
                lamports:items.amt * LAMPORTS_PER_SOL
            });
            // now we create a new transaction instance below
            const transaction = new Transaction()
            // we add the instruction to the transaction
            transaction.add(instruction)
            // here, we now sign and send the transaction out to the rpc
            const signature = await wallet.sendTransaction(transaction, connection)
            return signature
        },
        onSuccess:(signature)=>{
            balanceQuery.refetch();
            balanceQuery1.refetch()
            if(signature){
                toast(signature);
            }
        }
    })

    // function below handles getting all the users token
    const getTokens = useQuery({
        queryKey: ["name",{adress:provider.wallet.publicKey} ],
        queryFn: async()=>{
            const alltoken = await connection.getParsedTokenAccountsByOwner(provider.wallet.publicKey, {programId:TOKEN_2022_PROGRAM_ID})
            return alltoken
        }
    })

    return {sendSol, getTokens}
}