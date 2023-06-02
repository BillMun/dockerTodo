const express = require("express");
const serverResponses = require("../utils/responses");
const messages = require("../config/messages");
const  {BabyName}  = require("../models/BabyName");

const routes = (app) => {
  const router = express.Router();

  router.post('/babyname', async (req, res) => {
    try{
    const babyname = new BabyName({
      name: req.body.name,
    });
    babyname
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });}
      catch(error){next(error)}
  });

  router.get("/helloworld", (req, res)=>{
    try{
    let message = 'Hello World'
    serverResponses.sendSuccess(res, messages.SUCCESSFUL, message)
    }catch(e){serverResponses.sendError(res, messages.BAD_REQUEST, e)}
  })

  router.get("/", (req, res) => {
    BabyName.find({}, { __v: 0 })
      .then((babies) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, babies);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get("/babyname/:id", async (req,res,next) => {
    try{
      const baby = await BabyName.findById((req.params.id))
      res.status(200).send(baby)
    }catch(e){
      next(e)
    }
  })

  router.post("/babyname/:id/heights", async (req,res,next)=>{
    try{
      const babyNameId = req.params.id
      const newHeight = {
        height:req.body.height,
        date: req.body.date
      }
      console.log(newHeight)
      const babyName = await BabyName.findById(babyNameId)
      console.log(babyName)
      babyName.heights.push(newHeight)
      await babyName.save()
      res.status(200).json({message: "New Height entry added"})
    }catch(e){
      next(e)
    }
  })

  router.delete('/babyname/:id/', async (req,res,next)=>{
    console.log(req.params.id)
    try{
      const baby = await BabyName.findById(req.params.id)
      await baby.deleteOne()
      res.send(baby)
    }catch(e){next(e)}
  })

  app.use('/api', router);
};
module.exports = routes;