const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const http = require('http').createServer(app)

app.use(express.json())
app.use(cookieParser())

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}
app.use(session(sessionOptions))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:8080',
            'http://localhost:8080',
            'http://127.0.0.1:8081',
            'http://localhost:8081',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:3001',
            'http://localhost:3001',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

const toyRoutes = require('./api/toy/toy.routes')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const reviewRoutes = require('./api/review/review.routes')
const { connectSockets } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/toy', toyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)

connectSockets(http, session)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})
