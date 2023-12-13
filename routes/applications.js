const express = require('express');
const router = express.Router();
const {Applications,Employee,Jobs,Company} = require('../models'); //instance of model
const {validateEToken, validateCToken} = require('../middlewares/AuthMiddleware');

router.get('/',async (req,res)=>{
    const listofApplications = await Applications.findAll();  //select * from Applications
    res.json(listofApplications);
});

router.get('/byJobid/:id',validateCToken, async (req, res) => {
  const jobId = req.params.id;

    try {
      const employeesList = await Employee.findAll({
        include: [
          {
            model: Applications,
            where: {job_Id : jobId},
          },
        ],
      });
    res.json(employeesList);
  } catch (error) {
    console.error('Error fetching jobs by company:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/', validateEToken, async (req,res) => {
    const {status, job_Id} = req.body;
    const employee = await Employee.findOne({where:{user_Id:req.user.user_id}});   //can access user_id because of req.user=validToken in middleware
    const application = await Applications.findOne({where:{employee_Id: employee.employee_id,job_Id: job_Id,}});    //to stop multiple apply on same job
    if(!application){
      try {
        
        await Applications.create({status, job_Id, employee_Id: employee.employee_id});     //insert Applications
        res.json(Applications);
      } catch (error) {
        console.error('Error creating Applications:', error);
        res.status(500).json({ error: 'Failed to create Applications' });
      }
    }
    else{
      res.json({error:"Already Applied !"});
    }
});

router.post('/approve', validateCToken, async (req,res)=>{
  const {application_id} = req.body;
  const application = await Applications.findOne({where:{application_id:application_id}});
  if(application.status === 'pending'){
    try {
      const updatedApplication = await Applications.update(
        { status: "approved" },
        { where: { application_id: application_id } }
      );
    res.json(updatedApplication);
    } catch (error) {
      res.json({error:error});
    }
  }else{
    res.json({error:'Already approved !'});
  }
  
});

router.get('/myapplications', validateEToken, async (req,res)=>{
  const employee = await Employee.findOne({where:{user_Id:req.user.user_id}});
  try {
    const applications = await Applications.findAll({
      where: { employee_Id: employee.employee_id },
      include: [
        {
          model: Jobs,
          include: [{ model: Company }],
        },
      ],
    });
  res.json(applications);
  } catch (error) {
    res.json({error:error});
  }
});

module.exports = router;