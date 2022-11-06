const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],

    title:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,}
         
},
{
    timestamps:true
})

const Todo = mongoose.model('User',todoSchema);
module.exports = Todo;