import React from "react";
import {Hero, LeftDiv, Nav, RightDiv} from "./intro-ui"
import {Toaster} from "react-hot-toast"

const IntroFeature = ()=>{
    return(
        <div>
            <Nav/>
            <Hero/>
            <div className=" lg:flex lg:flex-row flex-col space-y-2 lg:space-x-2 w-full px-2">
                <LeftDiv/>
                <RightDiv/>
            </div>
            <Toaster position="top-center"/>
        </div>
    )
}
export default IntroFeature;