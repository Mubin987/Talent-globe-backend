const express = require('express');
const router = express.Router();
const {Users,Employee,Company,Countries} = require('../models'); //instance of model
const bcrypt = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get('/',async (req,res)=>{
    const listofUsers = await Users.findAll();  //select * from Users
    res.json(listofUsers);
});

router.post('/dashboard', validateToken, async (req,res)=>{
  const username = req.user.username;
  const usertype = req.user.usertype;
  res.json({username,usertype});
});

router.post('/signup/employee', async (req, res) => {
  const { name, username, contactno, cvlink, email, password } = req.body;
  const user = await Users.findOne({where:{username:username}});
  if(!user){
    try {
      const hash = await bcrypt.hash(password, 10); // Hash the password using bcrypt
      const user = await Users.create({ username, password: hash, usertype:'employee' }); // Create the user record with the hashed password
      await Employee.create({ name, contactno, cvlink, email, user_Id: user.user_id }); // Create the employee record associated with the newly created user
      res.json({ message: 'Signup Success' });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }else{
    res.json({error:"Username Taken"});
  }
});
router.post('/signup/company', async (req, res) => {
    const { name, username, description, industry, email, country, password } = req.body;
    const userFound = await Users.findOne({where:{username:username}});
    if(!userFound){
    try {
      const hash = await bcrypt.hash(password, 10); // Hash the password using bcrypt
      const user = await Users.create({ username, password: hash, usertype:'company' }); // Create the user record with the hashed password
      let countryobj = await Countries.findOne({     
        where:{
            country_name:country,
        },
      });  //select * from jobs where country_name = country
      if(!countryobj){
        countryobj = await Countries.create({ country_name:country });    //create new country record
        const company = await Company.create({ name,description,industry,email,country_Id: countryobj.country_id, user_Id: user.user_id });
      }
      else{
        const company = await Company.create({ name,description,industry,email,country_Id: countryobj.country_id, user_Id: user.user_id });
      }
      res.json({ message: 'Signup Success' });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }else{
    res.json({error:"Username Taken"});
  }
});
router.post('/login',async (req,res) => {
    const {username,password} = req.body;
    const user = await Users.findOne({where:{username:username}});
    if(!user)    
        res.json({error:"User doesn't exist"});
    else{
        bcrypt.compare(password,user.password).then((match)=>{
            if(!match)
                res.json({error:"Wrong Password"});
            else{
                //create a secure token representing the logged-in user by signing their information with a secret key
                const accessToken = sign({user_id:user.user_id,username:user.username,usertype:user.usertype},"importantsecret");
                res.json({accessToken,message:"LOGIN SUCCESSFUL",usertype:user.usertype});
            }
        });
    }
});

module.exports = router;