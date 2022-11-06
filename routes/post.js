const express = require('express');
const router = express.Router();

const Todo = require('../models/ToDo')
const User = require('../models/User')
// middleware for authentiation purpose
const auth = require('../middleware/auth')

//http://localhost:5000/task/create-todo
router.post('/create-todo', auth, async(req,res)=>{
    try {

        const user = await User.findById(req.user.id).select('-password')
        const newPost= new Todo({
            title:req.body.title,
            date :req.body.date,
            user:req.user.id
        })
    


       
       const post = await newPost.save();
        return res.status(200).json(post);
        
    } catch (error) {
        console.log(error)
    }
})


//http://localhost:5000/task/todo?limit=6&startDate=2022-10-06&endDate=2026-10-06
router.get('/todo', auth,async(req,res)=>{
    try {
        const page = parseInt(req.query.page) -1||0
        const limit = parseInt(req.query.limit)||5
        const search = req.query.search || "";
        let sort = req.query.sort ;
        let title = req.query.title ||"All"
        const date= new Date();
        const month = date.getMonth();
        const year = date.getFullYear();
        const startDate = req.query.startDate;
        const endDate = req.query.endDate
       
        const filters={
            date:{
                $gte:startDate,
                $lt:endDate
            }
        }
        const todo = await Todo.find({title:{$regex:search,$options:"i"}})
        .where(filters)
        .skip(page*limit)
        .limit(limit);
        const total = await Todo.countDocuments({
            title:{$regex:search,$options:"i"}
        })
        const result = await Todo.find();

        const response={
            error:false,
            total,
            page:page+1,
            todo

        }
        return res.status(200).json(response);

        
        
    } catch (error) {
        console.log(error)
    }
})


//http://localhost:5000/task/update-todo/:id
router.patch('/update-todo/:id',auth,async (req,res)=>{
    try {
        const requestId = req.params.id;
        const response = await Todo.findByIdAndUpdate({
            _id:requestId
        },{
            $set:{
                title:req.body.title,
                date:req.body.date
            }
        },{
            new:true
        })
        return res.status(200).json({msg:"update sucessfull",post:response})
        
    } catch (error) {
        console.log(error)
    }
})


//http://localhost:5000/task/todo/:id
router.delete('/todo/:id',auth,async (req,res)=>{
    try {
        let update = await Todo.findByIdAndDelete(req.params.id);
        if(!update){
            return res.json({msg:"wrong id or id does not exists"});
        }
       
        return res.status(200).json(update);
        
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;