// some data from frontend
//create user
//token ko cookie ka andar store karana hai


import genToken from "../config/token.js";
import User from "../models/user.model.js";
export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , {
            httpOnly:true, // Prevents XSS attacks by blocking JavaScript access
            secure:true, // why false : due to work on localhost , bcz only work on http not on https
            sameSite:"none", // Prevents CSRF attacks
            maxAge:7 * 24 * 60 * 60 * 1000
        })



//         res.cookie("token", token, {
//     httpOnly: true,      // JavaScript can't access it (prevents XSS attacks)
//     secure: false,       // Only send over HTTPS (false for localhost development)
//     sameSite: "strict",  // Only send cookie to your domain (prevents CSRF attacks)
//     maxAge: 7 * 24 * 60 * 60 * 1000  // Cookie expires in 7 days
// })

        return res.status(200).json(user)



    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
    
}


export const logOut = async (req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}