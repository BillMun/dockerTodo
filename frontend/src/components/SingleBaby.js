import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import AddBabyHeight from './AddBabyHeight'
import GetBabyHeights from './GetBabyHeights'
import DeleteBaby from './DeleteBaby'

export default function SingleBaby (){
    const params = useParams() 
    const [babyName, setBabyName] = useState({})
    const [addedHeight, setAddedHeight] = useState(false)
    const getSingleBaby = async()=>{

        let singleBaby = await axios.get(`http://localhost:3001/api/babyname/${params.id}`)
        setBabyName(singleBaby.data)
    }
    useEffect(()=>{
        getSingleBaby()
    },[addedHeight])

    const handleHeightAdded = ()=>{
        setAddedHeight(!addedHeight)
    }

    return(
        <div>
        {babyName._id ? <div>
            {babyName.name}
            <AddBabyHeight props={babyName} onHeightAdded={handleHeightAdded}/>
            <GetBabyHeights props={babyName}/>
            <DeleteBaby props={babyName}/>
            </div> : null}
            <div>
                <a href='/'>return Home</a> 
            </div>
        </div>
    )
}