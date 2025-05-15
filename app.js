const express =require('express')
const colors=require('colors')
const morgan=require('morgan')
const cors=require('cors')
const dotenv=require('dotenv')

const app=express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

const port=process.env.PORT || 3499
app.get('/',(req,res)=>{
    res.send("Hello this is the resturant website")
})
app.listen(port,()=>{
    console.log(`Server is runnuing on http://localhost:${port}`.white.bgGreen)
})