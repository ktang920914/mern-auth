import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) => {
    try {
        const {username, email, password} = req.body
    
        if(!username || !email || !password || username === '' || 
            email === '' || password === ''){
            return next(errorHandler(400, 'All fields are required'))
        }

        const signupUsername = await User.findOne({username})
        if(signupUsername){
            return next(errorHandler(400, 'Username is already exists'))
        }

        const signupEmail =  await User.findOne({email})
        if(signupEmail){
            return next(errorHandler(400, 'Email is already exists'))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        await newUser.save()
        res.status(201).json('Sign up successfully')

    } catch (error) {
        next(error)
    }
}

export const signin = async (req,res,next) => {
    try {
        const {email, password} = req.body

        if(!email || !password || 
            email === '' || password === ''){
            return next(errorHandler(400, 'All fields are required'))
        }
    
        const validUser = await User.findOne({email})
        if(!validUser){
            return next(errorHandler(404, 'User not found'))
        }
    
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(400, 'Invalid credentials'))
        }
    
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const {password:pass,...rest} = validUser._doc

        res.cookie('access_token', token , {
            httpOnly: true
        })
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const signout = async (req,res,next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('Sign out successfully')
    } catch (error) {
        next(error)
    }
}

export const google = async (req,res,next) => {
    try {
        const {name, email, googlePhotoUrl} = req.body
        const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id},process.env.JWT_SECRET)
      const { password, ...rest } = user._doc;
      res.cookie('access_token', token, {
          httpOnly: true,
        })
      res.status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save()
      const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET)
      const { password, ...rest } = newUser._doc;
        res.cookie('access_token', token, {
          httpOnly: true,
        })
        res.status(200).json(rest)
    }
    } catch (error) {
        next(error)
    }
}