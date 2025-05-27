import bcrypt from 'bcrypt'
import cloudinary from '../lib/cloudinary.js'
import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
export const signup = async (req, res) => {
	const { email, fullName, password } = req.body
	try {
		if (!email || !fullName || !password) {
			return res.status(400).json({ message: 'Please fill all fields' })
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: 'Password must be at least 6 characters long' })
		}
		const user = await User.findOne({ email })
		if (user) {
			return res.status(400).json({
				message: 'User already exist',
			})
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			email,
			fullName,
			password: hashedPassword,
		})

		if (newUser) {
			generateToken(newUser._id, res)
			await newUser.save()

			res.status(201).json({ message: 'User created successfully' })
		} else {
			return res.status(400).json({
				message: 'Invalid user data',
			})
		}
	} catch (error) {
		console.log('Error in signup controller', error.message)
	}
}
export const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({
				message: 'Credentials are not valid',
			})
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password)

		if (!isPasswordCorrect) {
			return res.status(400).json({
				message: 'Credentials are not valid',
			})
		}

		generateToken(user._id, res)

		res.status(200).json({
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			avatar: user.avatar,
		})
	} catch (error) {
		console.log('Error in login controller', error.message)
		res.status(500).json({
			message: 'Internal server error',
		})
	}
}
export const logout = (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 })
		res.status(200).json({
			message: 'Logged out successfully',
		})
	} catch (error) {
		console.log('Error in logout controller', error.message)
		res.status(500).json({
			message: 'Internal server error',
		})
	}
}

export const updateProfile = async (req, res) => {
	try {
		const { avatar } = req.body
		const userId = req.user._id

		if (!avatar) {
			return res.status(400).json({
				message: 'Please provide an avatar',
			})
		}

		const uploadResponse = await cloudinary.uploader.upload(avatar)

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				avatar: uploadResponse.secure_url,
			},
			{ new: true }
		)

		res.status(200).json({
			updatedUser,
		})
	} catch (error) {
		console.log('Error in updateProfile controller', error.message)
		res.status(500).json({
			message: 'Internal server error',
		})
	}
}

export const getAuthUser = async (req, res) => {
	try {
		res.status(200).json(req.user)
	} catch (error) {
		console.log('Error in getAuthUser controller', error.message)
		res.status(500).json({
			message: 'Internal server error',
		})
	}
}

export const updateFullName = async (req, res) => {
	const { fullName } = req.body
	const userId = req.user._id
	try {
		if (!fullName) {
			return res.status(400).json({
				message: 'Please provide a full name',
			})
		}
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				fullName: fullName.trim(),
			},
			{ new: true }
		)
		res.status(200).json({
			updatedUser,
		})
	} catch (error) {
		console.log('Error in updateFullName controller', error.message)
		res.status(500).json({
			message: 'Internal server error',
		})
	}
}
