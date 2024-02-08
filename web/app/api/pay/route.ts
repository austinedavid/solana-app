

import {SystemProgram, Connection, clusterApiUrl,PublicKey, LAMPORTS_PER_SOL, Transaction} from "@solana/web3.js"
import {web3} from "@coral-xyz/anchor"
import { error } from "console";
// lets make a get request to this end now
export async function GET(req:Request){
    const icon = "https://res.cloudinary.com/dffhwsp2h/image/upload/v1698191914/cld-sample-5.jpg";
    const label = "David programs"
    console.log("entered here")
    try {
        return new Response(JSON.stringify({label, icon}),{status:200})
    } catch (error) {
        console.log(error)
    }
}

// lets make a post request for the payment here
export async function POST(request:Request){
    const {account} = await request.json();
    if(!account || typeof(account)!= "string") throw new Error("your account is needed")
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const marchants =  new PublicKey("7FNZoEXrGxNvb1sDfxzfhWZCqrVWLW2du9Gdap7xjLcU");
    const payerAds = new PublicKey(account);
    // lets create an instruction for sending sol
    const instruction = SystemProgram.transfer({
        fromPubkey:payerAds,
        toPubkey:marchants,
        lamports: LAMPORTS_PER_SOL
    })
    // lets get the blockhash
    const block = await connection.getLatestBlockhash()
    // create a new instance of transaction
    let tx = new Transaction();
    tx.add(instruction)
    tx.recentBlockhash = block.blockhash;
    tx.feePayer = payerAds;
    tx  = Transaction.from(tx.serialize({verifySignatures:false, requireAllSignatures:false}));
    const serializeTransaction = tx.serialize({verifySignatures:false, requireAllSignatures:false});
    const base64 = serializeTransaction.toString("base64");
    const message = "thanks for being here";
    return new Response(JSON.stringify({transaction:base64, message}), {status:200})
}