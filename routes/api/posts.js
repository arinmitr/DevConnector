const express = require('express')
const { validationResult, check } = require('express-validator')
const auth = require('./../../middlewares/auth')
const Post = require('./../../models/Post')
const Profile = require('./../../models/Profile')
const User = require('./../../models/Users')
const router = express.Router()

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post(
    '/',
    [auth, [check('text', 'Text is required for the post').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            }
            const post = await Post.create(newPost)
            return res.status(201).json(post)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//@route    GET api/posts
//@desc     Get all posts
//@access   Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        return res.status(200).json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route    GET api/posts/:post_id
//@desc     Get post by ID
//@access   Private

router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        if (!post) {
            return res.status(404).json({ msg: 'No post found' })
        }
        return res.status(200).json(post)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' })
        }
        res.status(500).send('Server Error')
    }
})

//@route    DELETE api/posts/:post_id
//@desc     Delete post by ID
//@access   Private

router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        if (!post) {
            return res.status(404).json({ msg: 'No post found' })
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await Post.findByIdAndDelete(req.params.post_id)
        return res.status(204).json({ msg: 'Post deleted' })
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' })
        }
        res.status(500).send('Server Error')
    }
})

//@route    PUT api/posts/like/:post_id
//@desc     Like a post
//@access   Private

router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        if (!post) {
            return res.status(404).json({ msg: 'No post found' })
        }
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' })
        }
        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.status(200).json(post.likes)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' })
        }
        res.status(500).send('Server Error')
    }
})

//@route    PUT api/posts/unlike/:post_id
//@desc     Unlike a post
//@access   Private

router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        if (!post) {
            return res.status(404).json({ msg: 'No post found' })
        }
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: 'Post has not been liked yet' })
        }
        post.likes = post.likes.filter(
            ({ user }) => user.toString() !== req.user.id
        )

        await post.save()

        res.status(200).json(post.likes)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route    PUT api/posts/comment/:post_id
// @desc     Comment on a post
// @access   Private
router.put(
    '/comment/:post_id',
    [auth, [check('text', 'Text is required for the post').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.post_id)
            if (!post) {
                return res.status(404).json({ msg: 'No post found' })
            }
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            }
            post.comments.unshift(newComment)
            await post.save()
            res.status(200).json(post.comments)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

// @route    PUT api/posts/comment/:post_id/:comment_id
// @desc     Delete Comment on a post
// @access   Private
router.put('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.post_id)

        if (!post) {
            return res.status(404).json({ msg: 'No post found' })
        }
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        )
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' })
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }
        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        )
        res.status(200).json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
