"use client"
import {getAssociatedTokenAddress, getMint, createAssociatedTokenAccountInstruction} from "@solana/spl-token"
import {useQuery, useMutation} from "@tanstack/react-query"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {Keypair, PublicKey, Transaction} from "@solana/web3.js"
import { web3 } from "@coral-xyz/anchor"
// first functions to export 
export const useTransfer = ()=>{
    const {connection} = useConnection();
    const Mintaddress = new PublicKey("6QGKcYbGBompTSQHNMb6c3n1G6kTNJxtxpEQ66xiHS1V");
    const wallet = useWallet()
    // getting the mint informations
    const tokenDetails = useQuery({
        queryKey:["keys"],
        queryFn: async()=> await getMint(connection, Mintaddress)
    });
    // getting the ata of the user
    const getAta = useMutation({
        mutationKey:["keep"],
        mutationFn:async()=>{
            // checking if there is no wallet, then we connect to it immediatly if non exist
            if(!wallet.publicKey){
                await wallet.connect()
            }
            // here we now get the ATA that will be used in the transaction
            const ata = await getAssociatedTokenAddress(Mintaddress, new web3.PublicKey("BusGmPcQL6Roe7ffDMrH7ZeqFheRAU7Gha8cQWeuRzzG"))
            console.log(ata.toBase58())
            // here we will register the ata and make it assessible to all
            // lets start by creating the instance of the transaction first
            const transaction = new Transaction();
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey!,
                    ata,
                    new web3.PublicKey("BusGmPcQL6Roe7ffDMrH7ZeqFheRAU7Gha8cQWeuRzzG"),
                    Mintaddress
                )
            )
            // here we will submit the transaction and return a signature
            const signature = await wallet.sendTransaction(transaction, connection)
            console.log(signature)
        }
    })
    return{tokenDetails, getAta}
}