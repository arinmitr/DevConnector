const express = require('express')
const axios = require('axios')
const config = require('config')
const { validationResult, check } = require('express-validator')
const auth = require('./../../middlewares/auth')
const Profile = require('./../../models/Profile')
const User = require('./../../models/Users')
const Post = require('./../../models/Post')
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

//@route    GET api/profile/user/user_id
//@desc     Get profile by user ID
//@access   Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(404).json({
                msg: 'Profile not found',
            })
        }
        res.status(200).json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Profile not found',
            })
        }
        res.status(500).send('Server error')
    }
})

//@route    DELETE api/profile/
//@desc     Delete profile, posts & user
//@access   Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove posts
        await Post.deleteMany({ user: req.user.id })
        //Remove Profile
        await Profile.findOneAndDelete({ user: req.user.id })
        //Remove User
        await User.findOneAndDelete({ _id: req.user.id })
        res.status(204).json({ msg: 'User deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@route    PUT api/profile/experience
//@desc     Add Profile Experience
//@access   Private

router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            })
        }
        const { title, company, location, from, to, current, description } =
            req.body
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })

            profile.experience.unshift(newExp)

            await profile.save()

            res.status(201).json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete Profile Experience
//@access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience = profile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        )

        await profile.save()

        res.status(200).json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route    PUT api/profile/education
//@desc     Add Profile education
//@access   Private

router.put(
    '/education',
    [
        auth,
        [
            check('institution', 'Institution is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            })
        }
        const {
            institution,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body
        const newEdu = {
            institution,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })

            profile.education.unshift(newEdu)

            await profile.save()

            res.status(201).json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete Profile Education
//@access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education = profile.education.filter(
            (edu) => edu._id.toString() !== req.params.edu_id
        )

        await profile.save()

        res.status(200).json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route    GET api/profile/github/:username
//@desc     Get user repos from github
//@access   Public

router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
        )
        const headers = {
            'user-agent': 'node.js',
            Authorization: `token ${config.get('githubToken')}`,
        }

        const gitHubResponse = await axios.get(uri, { headers })

        return res.json(gitHubResponse.data)
    } catch (err) {
        console.error(err.message)
        res.status(404).json({ msg: 'No Github profile found' })
    }
})
module.exports = router
