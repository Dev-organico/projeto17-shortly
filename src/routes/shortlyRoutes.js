import { Router } from 'express'
import { validateSchema } from '../middlewares/validateSchema.js'
import { authValidation } from '../middlewares/authValidation.js'
import { urlSchema } from '../schemas/urlSchema.js'
import { getUrl, shorten } from '../controllers/shortly.js'


const shortlyRouter = Router()

shortlyRouter.post('/urls/shorten',validateSchema(urlSchema),authValidation,shorten)
shortlyRouter.get('/urls/:id',getUrl)


export default shortlyRouter;