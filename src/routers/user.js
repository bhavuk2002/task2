const express = require('express')
const User = require('../models/user.js')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
        
    const user = new User(req.body)

    try {
        
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    } catch (error) {
    
        res.status(400).send(error)
    }

})

router.get('/users/login', async (req, res) => {


    try{
        const user = await User.findbyCredentials(req.query.email, req.query.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e){
     
        res.status(400).send(e)
    
    }

})

router.post('/users/logout', auth, async (req, res) => {

    try{

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()

    } catch (e) {

        res.status(500).send()

    }

})

module.exports = router