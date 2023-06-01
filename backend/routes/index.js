const express = require("express");
const serverResponses = require("../utils/responses");
const messages = require("../config/messages");
const { BabyName } = require("../models/BabyName");

const routes = (app) => {
  const router = express.Router();

  router.post('/babyname', async (req, res) => {
    console.log(req.body)
    try{
    console.log(req.body)
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

  router.get("/", (req, res) => {
    BabyName.find({}, { __v: 0 })
      .then((todos) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });


  app.use('/api', router);
};
module.exports = routes;