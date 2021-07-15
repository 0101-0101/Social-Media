const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')

// connect dotenv
require('dotenv').config({
    path: './config/config.env'
})


const app = express()

// Parse request body to Json
app.use(express.json())



connectDB();


app.use(cors());

if (process.env.NODE_ENV === 'development'){
    app.use(cors());
    // app.use(cors({
    //     origin : process.env.CLIENT
    // }))

    app.use(morgan('dev'))
    // Morgan gives information about each HTTP request
}



// Load all Routes
const authRouter = require('./routes/auth.route')

// Use Routes
app.use('/api/',authRouter)


app.use((req,res) => {
    res.status(404).json({
        sucess: false,
        msg: "Page not Found"
    })
})

const PORT = process.env.PORT || 5000



app.listen(PORT , () => {
    console.log(`App listening on port ${PORT}`)
})

