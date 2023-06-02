import React from "react";
import axios from "axios";


export default function DeleteBaby(props){
    const handleDelete = async (e)=>{
        e.preventDefault()
        const confirmDelete = window.confirm("are you sure you want to DELETE THAT BAAAABY??!!?")
        if(confirmDelete){
            try{
                await axios.delete(`http://localhost:3001/api/babyname/${props.props._id}`)
                window.location.href = "/"
            }catch(error){
            console.error('error deleting that baby')
            }
        }
    }

    return(
        <div>
        <form onSubmit={handleDelete}>
            <button type='submit'>Delete That Baby!</button>
        </form>
        </div>
    )
}