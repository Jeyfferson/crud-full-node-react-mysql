const express = require('express');
const router = express.Router();
const db = require('./../db/models');

router.post("/add", async (req, res) => {

   var data = req.body;
   //console.log(data);

   await db.Users.create(data)
   .then((dataUsers) => {
      res.json({
         message: "All right, Register is good!",
         dataUsers
      })      
   })
   .catch(() =>{
      res.json({
         message: "Error registering"
      })
   })

})






module.exports = router;