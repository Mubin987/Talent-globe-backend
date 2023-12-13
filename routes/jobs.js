const express = require('express');
const router = express.Router();
const {Jobs,Company,Countries} = require('../models'); //instance of model
const { literal } = require('sequelize');
const {validateCToken} = require('../middlewares/AuthMiddleware');

router.get('/',async (req,res)=>{
    const listofJobs = await Jobs.findAll({ include:[{model:Company}]  });  //select * from jobs join company
    res.json(listofJobs);
});

router.get('/:id',async (req,res)=>{
  const jobId = req.params.id;
  const job = await Jobs.findOne({       //.findAll will return arr(it will be length 1 but still !work)
    where:{
      job_id:jobId,
    },
    include:[{model:Company}],
  });  //select * from jobs where job_id = jobId
  res.json(job);
});

router.get('/by/company', validateCToken, async (req, res) => {                           //do not make route like /bycompany bcuz see above api
  try {
      const userid = req.user.user_id;
      const company = await Company.findOne({ where: { user_Id: userid } });
      if (!company) {
          return res.json({ error: "Company not found" });
      }
      const jobsByCompany = await Jobs.findAll({ include:[{model:Company,where: { company_id: company.company_id }}]  });
      res.json( jobsByCompany );
  } catch (error) {
      console.error('Error fetching jobs by company:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/byCountry/:countryId', async (req, res) => {
  const countryId = req.params.countryId;

    try {
      const jobsByCountry = await Jobs.findAll({
        include: [
          {
            model: Company,
            include: [
              {
                model: Countries,
                where: { country_id: countryId, },        //joined tables
              },
            ],
            where: literal(`Company.country_Id = ${countryId}`),
          },
        ],
      });
    res.json(jobsByCountry);
  } catch (error) {
    console.error('Error fetching jobs by company:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/',validateCToken,async (req,res) => {
    const {title,description} = req.body;
    const company = await Company.findOne({where:{user_Id:req.user.user_id}});  //can access user_id because of req.user=validToken in middleware
    //wait for data to be inserted before proceed with request
    //await Jobs.create(job); //sequilize function to insert record
    //res.json(job);
    try {
        const job = await Jobs.create({title,description,company_Id:company.company_id});  //insert a record in jobs table
        res.json(job);
      } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
      }
      
});

router.post('/delete',validateCToken,async (req,res) => {
  const {jobId} = req.body;
  Jobs.destroy({where: {job_id: jobId}})
      .then((rowsDeleted) => {
        if (rowsDeleted === 1) {
          res.json({message:'Delete Success'});
        } else {
          res.json({error:'Job not found'});
        }
      })
      .catch((error) => {
        res.json({error:error});
      }); 
  
});

module.exports = router;