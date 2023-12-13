const express = require("express");
const app = express();
const cors = require('cors');  //Cross-origin resource sharing
require('dotenv').config();

app.use(express.json());
app.use(cors());          //middleware

const db = require('./models');

// Routers as middleware
const jobRouter = require('./routes/jobs');
app.use('/jobs',jobRouter);       //you can use '/jobs' and '/' in either file routers or here
const companyRouter = require('./routes/company');
app.use('/companies',companyRouter); 
const countryRouter = require('./routes/countries');
app.use('/countries',countryRouter); 
const usersRouter = require('./routes/users');
app.use('/auth',usersRouter); 
const applicationRouter = require('./routes/applications');
app.use('/applications',applicationRouter); 

app.get('/',(req,res)=>{
    res.send('From server');
});

db.sequelize.sync().
    then(()=>{ //before server starts check the tables
        app.listen(process.env.PORT || 3001, () =>{
            console.log('Server running on port 3001');
        });
    })
    .catch((err)=>{
        console.log(err);
    });
 
