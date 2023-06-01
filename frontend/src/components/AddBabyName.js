import React, {useState} from "react";
import axios from "axios"

export default function AddBabyName (){
    const [babyname, setBabyName] = useState({})
    const handleAddBabyName = (e)=>{
        e.preventDefault()
        const { value } = e.target.elements.value
        console.log(value)
        axios
            .post('http://localhost:3001/api/babyname', {name:value})
            .then(()=>{
                setBabyName(value)
            })
            .catch((e)=>console.log("error : ", e))
    }
    return(
        <div>
            <p>{babyname.length > 0 ? babyname:'please enter your babyname'}</p>
            <form
                onSubmit={handleAddBabyName}
            >
                <input
                type='text'
                name='value'
                required
                minLength={1}
                />
                <button type='submit'>
                    Add your baby name
                </button>
            </form>
        </div>
    )
    
}
