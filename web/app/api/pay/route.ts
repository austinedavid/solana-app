
// lets make a get request to this end now
export async function GET(req:Request){
    const imgLink = "https://res.cloudinary.com/dffhwsp2h/image/upload/v1698191914/cld-sample-5.jpg";
    const label = "David programs"
    console.log("entered here")
    try {
        return new Response(JSON.stringify({label:label, icon:imgLink}),{status:200})
    } catch (error) {
        console.log(error)
    }
}