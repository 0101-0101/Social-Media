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


const path = require("path");
app.use(express.static(path.join(__dirname, '/')))  

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
const postRouter = require('./routes/post.route')
const userRouter = require('./routes/user.route')
const conversationRoute = require("./routes/conversations.route.");
const messageRoute = require("./routes/messages.route");

// Use Routes
app.use('/api/',authRouter)
// app.use('/api/users/', userRouter)
app.use('/',postRouter)
app.use('/',userRouter)
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


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

