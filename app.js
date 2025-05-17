const express = require('express');
const morgan = require('morgan');
const color=require('colors')
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rootDir=require("./util/pathUtil")
const mongoose = require('mongoose');
const db_path=process.env.DB_PATH || "mongodb+srv://Bhaskar:9mq2vhvm@cluster0.83acb5s.mongodb.net/captainKatora"
const session=require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const multer = require('multer');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

const store=new MongoDbStore({
  url: db_path,
  collection: 'sessions',
  ttl: 14 * 24 * 60 * 60, // = 14 days. Default
});

app.use(session({
  secret:"Bhaskar and mansi forever",
  resave: false,
  saveUninitialized: false,
  store: store,
}))

const randomString=(length)=>{
  const chars="abcdefghijklmnopqrstuvwxyz"
  let res=''
  for(let i=0;i<chars.length;i++){
    res+=chars.charAt(Math.floor(Math.random()*chars.length))
  }
  return res
}

const storage=multer.diskStorage({
  destination:(req,file,cd)=>{
    cb(null,"uploads/")
  },
  filename:(req,file,cd)=>{
    cd(null,randomString(10)+"-"+file.originalname)
  }
})

const fileFilter=(req,file,cd)=>{
  if(file.mimeType==="image/png" || file.mimeType==="image/jpeg" || file.mimeType==="image/jpg" ){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

const mullterOperations={
  storage,fileFilter
}

app.use(multer(mullterOperations).single('photo'))
app.use("/uploads",express.static(path.join(rootDir,"uploads")))
app.use("/host/uploads",express.static(path.join(rootDir,"uploads")))
app.use("/users/uploads",express.static(path.join(rootDir,"uploads")))

// Routes
const userRouter = require('./routes/userRoute');
const hostRouter = require('./routes/hostRoute');
const authRouter = require('./routes/authRouter');
app.use('/', userRouter);
app.use('/host',(req,res,next)=>{
  if(req.session.isLoggedIn){
    next();
  }else{
    redirect('/login')
  }
})

app.use('/host', hostRouter);
app.use('/auth', authRouter);


const port = process.env.PORT || 3499;

mongoose.connect(db_path).then(()=>{
  console.log("Connected to mongoDb");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`.white.bgGreen);
  });  
}).catch(err=>{
  console.log("Error while connecting to mongo",err);
  
})

