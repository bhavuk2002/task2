const mongoose = require('mongoose')
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
    },
    age: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
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