const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { validationResult, check } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('./../../models/Users')
const router = express.Router()

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check(
            'password',
            'Please provide a valid password of 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body
        try {
            // Check if user exists
            let user = await User.findOne({ email })
            if (user) {
                res.status(400).json({
                    errors: [{ msg: 'User already exists' }],
                })
            }
            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            })
            // Encrypt password
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
            // Create user
            const newUser = await User.create({
                name,
                email,
                avatar,
                password: hashedPassword,
            })
            // Send jsonwebtoken
            const payload = {
                user: { id: newUser.id },
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 24 * 60 * 60 },
                (err, token) => {
                    if (err) throw err
                    res.status(201).json({ token })
                }
            )
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

module.exports = router
