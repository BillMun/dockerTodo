import React, { useEffect } from "react";
import axios from "axios";

export default function AddBabyHeight (props){

    const handleAddHeight = async (e) =>{
        e.preventDefault()
        const {value} = e.target.elements.value
        const newHeight = {
            height: Number(value),
            date: new Date()
        }
        try{
        await axios.post(`http://localhost:3001/api/babyname/${props.props._id}/heights`, newHeight)
        props.onHeightAdded()}
        catch(error){
            console.error('error adding height', error)
        }
        
    }
    return(
        <div>
            <p>
                What is {props.props.name}'s' height in inches
            </p>
            <form
                onSubmit={handleAddHeight}
            >
                <input type='number'
                    name='value'
                    required
                    minLength={1}
                />
                <button type='submit'>
                    Add Height
                </button>
            </form>
        </div>
    )
}