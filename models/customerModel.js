const mongoose=require('mongoose')

const customerModelSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true, "First name is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true ,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"],
        default:"Female"
    }
})

module.exports=mongoose.model('Customer',customerModelSchema)