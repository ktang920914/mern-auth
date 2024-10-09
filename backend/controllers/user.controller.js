import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req,res,next) => {
    res.json({message: 'Test API is running'})
}

export const getUsers = async (req,res,next) => {
    try {
        const users = await User.find()
        const userWithoutPassword = users.map((user) => {
            const {password,...rest} = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()

        res.status(200).json({
            users:userWithoutPassword,
            totalUsers
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req,res,next) => {
    try {
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, 'You are not allowed to delete user'))
        }
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('Delete successfully')
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req,res,next) => {
    try {
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, 'You are not allowed to update user'))
        }

        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }


        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture:req.body.profilePicture
            }
        },{new: true})

        const {password:pass,...rest} = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}
