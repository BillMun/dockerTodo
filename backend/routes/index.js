const express = require('express')
const serverResponses = require('../utils/responses.js')
const messages = require("../config/mesages")
const { Todo } = require('../models/todos/todo')

const routes = (app) =>{
    const router = express.Router()

    router.post("/todos", (req,res)=>{
        const todo = new Todo({
            text: req.body.text
        })
        todo.save()
        .then((result)=>{
            serverResponses.sendSuccess(res, messages.SUCCESSFUL, result)
        }).catch((e)=>{
            serverResponses.sendError(res, messages.BAD_REQUEST,e)
        })
    })

    router.get("/", (req))
}

module.exports = routes