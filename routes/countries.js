const express = require('express');
const router = express.Router();
const {Countries} = require('../models'); //instance of model

router.get('/',async (req,res)=>{
    const listofCountries = await Countries.findAll();  //select * from Countries
    res.json(listofCountries);
});

router.get('/:id',async (req,res)=>{
  const countryId = req.params.id;
  const country = await Countries.findOne({       //.findAll will return arr(it will be length 1 but still !work)
    where:{
      country_id:countryId,
    },
  });  //select * from Countries where country_id = countryId
  res.json(country);
});

router.post('/',async (req,res) => {
    const country = req.body;
    //wait for data to be inserted before proceed with request
    //await Countries.create(country); //sequilize function to insert record
    //res.json(country);
    try {
        await Countries.create(country);  //insert a record in Countries table
        res.json(country);
      } catch (error) {
        console.error('Error creating country:', error);
        res.status(500).json({ error: 'Failed to create country' });
      }
      
});

module.exports = router;