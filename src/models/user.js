const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error('Email is invalid')
        //     }
        // }
    },
    age: {
        type: Number,
        default: 0,
        // validate(value){
        //     if(value < 0){
        //         throw new Error('Age must be a positive number') 
        //     }
        // }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        // validate(value){
        //     // if(value.length < 7){
        //     //     throw new Error('Password must be greater than 6 digits')
        //     // } or we can use minlength
        //     if(value.toLowerCase().includes('password')){
        //         throw new Error('Password must not contain password in it')
        //     }
        // }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// hash plain password before saving
userSchema.pre('save', async function(next){

    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})


userSchema.methods.generateAuthToken = async function (){

    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, "THISISSECRET")
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

userSchema.statics.findbyCredentials = (async (email, password) => {
    
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

})

const User = mongoose.model('User', userSchema)



module.exports = User