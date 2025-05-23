const Users=require('../../models/customerModel')
const { check,  validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')

exports.getSignInPage = (req, res) => {
    res.render('auth/signUp',{
         title:"SignUp",
         isLoggedIn:false,
         errors:[],
         oldInput:{username:"",email:"",userType:""},
         user:{}
        });
}

exports.getLoginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Login Page',
        isLoggedIn:false,
        errors:[],
        oldInput:{email:""},
        user:{}
    });
}

exports.postSignInPage =[check("username")
    .trim()
    .isLength({min:2})
    .withMessage("Username should be atleast 2 character")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name contains only letters"),

    check("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

    check("password")
    .isLength({min:6})
    .withMessage("Password should be ateleast 6 digit long")
    .matches(/[A-Z]/)
    .withMessage("Password should containa atleast one capital letter")
    .matches(/[a-z]/)
    .withMessage("Password should containa atleast one small letter")
    .matches(/[0-9]/)
    .withMessage("Password should containa atleast one number")
    .matches(/[!@#$%^&]/)
    .withMessage("Password should containa atleast one specail character")
    .trim(),

    check("confirmPassword")
    .trim()
    .custom((value, {req})=>{
        if(value!==req.body.password){
            throw new Error("Password does not match");
        }
        return true
    }),
    
    check("userType")
    .notEmpty()
    .withMessage("Please select the gender")
    .isIn(["Customer","Owner"])
    .withMessage("Invalid user type"),

    check("agree")
    .notEmpty()
    .withMessage("Please fill the checkbox")
    .custom((val,{req})=>{
        if(val!='on'){
            throw new Error("Please accept terms and condition");
        }
        return true
    }),

    async(req,res,next)=>{
        const {username,password,email,userType}=req.body
        if (req.body.userType === "Owner") {
            const ownerCount = await Users.countDocuments({ userType: "Owner" });
            if (ownerCount >= 2) {
                return res.status(422).render('auth/signUp', {
                    title: "Sign up",
                    isLoggedIn: false,
                    errors: ["Owner limit is full. No more owners can be created."],
                    oldInput: { username: req.body.username, email: req.body.email, userType: req.body.userType },
                    user: {}
                });
            }
        }
        const exists=await Users.findOne({email})
        if(exists){
            return res.render('auth/signUp',{
                title:"Sign up",
                isLoggedIn:false,
                errors:["User already exists go to login page"],
                oldInput:{},
                user:{}
            })
        }
        const errors=validationResult(req)
        console.log(errors.array());
        
        if(!errors.isEmpty()){
            return res.status(422).render("auth/signUp",{
                title:"Sign up",
                isLoggedIn:false,
                errors:errors.array().map(err=>err.msg),
                oldInput:{username,password,email,userType},
                user:{}
            })
        }
       bcrypt.hash(password,12)
       .then(hashedPassword=>{
            const user=new Users({username,password:hashedPassword,email,userType})
            return user.save()
       })
       .then(()=>{
            res.redirect("/auth/login")
       })
       .catch(err=>{
        console.log("Error while saving user",err);
        return res.status(422).render('auth/signUp',{
            title:"Sign up",
            isLoggedIn:false,
            errors:[err.message],
            oldInput:{username,email,password,userType},
            user:{}
        })
       })
    }
]


exports.postLoginPage = async(req, res ,next) => {
    const{email,password}=req.body
    const user=await Users.findOne({email})
    if(!user){
        return res.status(422).render('auth/login',{
            title:"Login",
            isLoggedIn:false,
            errors:["User does not exists"],
            oldInput:{email},
            user:{}
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(422).render('auth/login',{
            title:"Login",
            isLoggedIn:false,
            errors:["Incorrect password"],
            oldInput:{email},
            user:{}
        })
    }
    req.session.isLoggedIn=true
    req.session.user=user
    await req.session.save()
    res.redirect('/')
}

exports.postLogOutPage = (req, res) => {
    req.session.destroy(err=>{
        if(err){
            console.log("Error while destroying session",err);
        }
        res.redirect('/auth/login')
    })
}