const express = require('express')
const { validationResult, check } = require('express-validator')
const auth = require('./../../middlewares/auth')
const Profile = require('./../../models/Profile')
const User = require('./../../models/Users')
const router = express.Router()
//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        )
        if (!profile) {
            res.status(404).json({ msg: 'There is no profile for this user' })
        } else {
            res.status(200).json(profile)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@route    POST api/profile
//@desc     Create or update user profile
//@access   Private

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            linkedin,
        } = req.body

        //Build profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.website = website
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername
        if (skills) {
            profileFields.skills = skills
                .split(',')
                .map((skill) => skill.trim())
        }
        //Build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (twitter) profileFields.social.twitter = twitter
        if (linkedin) profileFields.social.linkedin = linkedin
        if (facebook) profileFields.social.facebook = facebook
        try {
            let profile = await Profile.findOne({ user: req.user.id })

            // Check if profile exists and update
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    {
                        $set: profileFields,
                    },
                    { new: true }
                )
                return res.status(200).json(profile)
            }

            // Create a new profile
            profile = await Profile.create(profileFields)
            return res.status(201).json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)
module.exports = router
