import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"


const app = express() 
const PORT = process.env.PORT || 6000 
app.use(cors({
  origin:"http://localhost:5173", // jha seih frontend request kar sakta hai
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use("/api/interview",interviewRouter)

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`) ;
  connectDb()
})


