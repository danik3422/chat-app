import express from 'express'
import {
	getAuthUser,
	login,
	logout,
	signup,
	updateFullName,
	updateProfile,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile)
router.patch('/full-name', protectRoute, updateFullName)
router.get('/get-user', protectRoute, getAuthUser)
router.get('/:id/verify/:token')

export default router
