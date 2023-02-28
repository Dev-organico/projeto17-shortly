import { Router } from 'express'
import { validateSchema } from '../middlewares/validateSchema.js'
import { authValidation } from '../middlewares/authValidation.js'
import { urlSchema } from '../schemas/urlSchema.js'
import { shorten } from '../controllers/shortly.js'


const shortlyRouter = Router()

shortlyRouter.post('/urls/shorten',validateSchema(urlSchema),authValidation,shorten)


export default shortlyRouter;