import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js"



