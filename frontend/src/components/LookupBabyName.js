import React, {useState, useEffect} from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'


export default function LookupBabyName (){
    const [babyNames, setBabyNames] = useState([])
    const [addedBaby, setAddedBaby] = useState(false)
    
    const getBabys = async () => {
        let babies = await axios.get("http://localhost:3001/api")
        setBabyNames(babies.data.data)
        setAddedBaby(!addedBaby)
    }

    useEffect( ()=>{
        getBabys()

    },[addedBaby])

    return(<div>
        {babyNames.length ? 
        <div>{babyNames.map((baby, idx)=>{
            return(
            <li key = {idx} > 
            <Link to={`/babies/${baby._id}/`}>{baby.name}</Link>
            </li>)
        })}
        </div>:null}

        </div>
    )
}