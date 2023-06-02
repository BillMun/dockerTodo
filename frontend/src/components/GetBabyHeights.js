import React from "react"


export default function GetBabyHeights (props){
    const heights = props.props.heights

    return(
        <div>
            {heights.length ? <div>
                {heights.map((height)=>{
                    return(
                    <li key={height._id}>
                        {`${props.props.name} was ${height.height} inches on ${height.date}`}
                    </li>)
                })}
            </div> :null}
        </div>
    )
}