const express = require('express');
const router = express.Router();
const {Company} = require('../models'); //instance of model

router.get('/',async (req,res)=>{
    const listofCompany = await Company.findAll();  //select * from company
    res.json(listofCompany);
});

router.get('/:id',async (req,res)=>{
  const companyId = req.params.id;
  const company = await Company.findOne({       //.findAll will return arr(it will be length 1 but still !work)
    where:{
      company_id:companyId,
    },
  });  //select * from Company where company_id = companyId
  res.json(company.name);
});

router.post('/',async (req,res) => {
    const company = req.body;
    //wait for data to be inserted before proceed with request
    //await Company.create(company); //sequilize function to insert record
    //res.json(company);
    try {
        await Company.create(company);     //insert company
        res.json(company);
      } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Failed to create company' });
      }
      
});

module.exports = router;