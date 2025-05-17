const express=require('express')

const userRouter=express.Router()
const userController = require('../controller/userController/userController');
userRouter.get('/',userController.getHomePage)
userRouter.get('/menu',userController.getMenuPage)
module.exports=userRouter