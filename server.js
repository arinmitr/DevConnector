const express = require('express')
const connectDB = require('./config/db')
const userRouter = require('./routes/api/users')
const authRouter = require('./routes/api/auth')
const profileRouter = require('./routes/api/profile')
const postRouter = require('./routes/api/posts')
const app = express()

// Connect to database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))
app.get('/', (req, res) => res.send('API Running'))

//Define routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postRouter)

// Start server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}...`))
