const express = require('express');
const port =5000;
const app = express();
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/jobAssignment', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);


//
// Please watch the video to see it working : https://youtu.be/PJJJgkEUIrA

///
app.use(express.json());

app.use('/',require('./routes/authentication'));
app.use('/task',require('./routes/post'));

app.listen(port,(err)=>{
    if(err){console.log(err);
    console.log(`server is running on ${port}`)}
})