const express=require('express')

const authRouter=express.Router()
const authController = require('../controller/authController/auth');
authRouter.get('/signUp',authController.getSignInPage)
authRouter.get('/login',authController.getLoginPage)
authRouter.post('/signUp',authController.postSignInPage)
authRouter.post('/login',authController.postLoginPage)  
authRouter.post('/logout',authController.postLogOutPage)  
module.exports=authRouter