const mongoose=require('mongoose')

const customerModelSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true, "First name is required"],
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
    userType:{
        type:String,
        enum:["Customer","Owner"],
        default:"Customer"
    }
})

module.exports=mongoose.model('Customer',customerModelSchema)