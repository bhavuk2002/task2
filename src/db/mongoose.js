const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/user-login-api", {
    useNewUrlParser: true,
    // useCreateIndex: true // useCreateIndex is depriciated // both depriciated
})