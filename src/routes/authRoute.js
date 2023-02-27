import { Router } from 'express'
import { validateSchema } from '../middlewares/validateSchema.js'
import { signUpSchema } from '../schemas/signUpSchema.js'
import { signInSchema } from '../schemas/signInSchema.js'
import { signIn, signUp } from '../controllers/auth.js'


const authRouter = Router()

authRouter.post('/signup',validateSchema(signUpSchema),signUp)
authRouter.post('/signin',validateSchema(signInSchema),signIn)

export default authRouter;