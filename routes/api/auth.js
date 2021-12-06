const express = require('express')
const { validationResult, check } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const auth = require('./../../middlewares/auth')
const User = require('./../../models/Users')
const router = express.Router()
//@route    GET api/auth
//@desc     Authorize user
//@access   Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).json('Server error')
    }
})

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   Public
router.post(
    '/',
    [
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, password } = req.body
        try {
            // Check if user exists
            let user = await User.findOne({ email })
            if (!user) {
                res.status(400).json({
                    errors: [{ msg: 'Invalid credentials' }],
                })
            }
            //Check password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.status(400).json({
                    errors: [{ msg: 'Invalid credentials' }],
                })
            }
            // Send jsonwebtoken
            const payload = {
                user: { id: user.id },
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 24 * 60 * 60 },
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
                }
            )
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

module.exports = router
