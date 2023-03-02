import { Router } from 'express'
import { validateSchema } from '../middlewares/validateSchema.js'
import { authValidation } from '../middlewares/authValidation.js'
import { urlSchema } from '../schemas/urlSchema.js'
import { deleteShortUrl, getRanking, getUrl, getUser, openShortUrl, shorten } from '../controllers/shortly.js'


const shortlyRouter = Router()

shortlyRouter.post('/urls/shorten',validateSchema(urlSchema),authValidation,shorten)
shortlyRouter.get('/urls/:id',getUrl)
shortlyRouter.get('/urls/open/:shortUrl',openShortUrl)
shortlyRouter.delete('/urls/:id',authValidation,deleteShortUrl)
shortlyRouter.get('/users/me',authValidation,getUser)
shortlyRouter.get('/ranking',getRanking)

export default shortlyRouter;