import React from "react"
import {Routes, Route} from 'react-router-dom'
import Splash from "./components/Splash"
import Hello from "./components/Hello"


export default function App (props){
    return(
        <div id="main">
            <Routes>
                <Route index element = {<Splash/>}/>
                <Route path={'/hello'} element={<Hello/>}/>
            </Routes>
        </div>
    )
}