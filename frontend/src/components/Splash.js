import React from "react";
import AddBabyName from "./AddBabyName";
import LookupBabyName from "./LookupBabyName";

export default function Splash (){
    return(
        <div>
            <h1>
                Welcome to track that baby!
            </h1>
            <AddBabyName/>
            <LookupBabyName/>
        </div>
    )
}