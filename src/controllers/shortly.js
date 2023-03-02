import {db} from "../config/database.js"
import { nanoid } from 'nanoid'

export async function shorten(req, res) {

    const {url} = req.body

    const token = res.locals.session

    const shortUrl =  nanoid()

    try {

        const findId = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token])

        const userId = findId.rows[0].user_id

        await db.query(`INSERT INTO urls (user_id,url,short_url) VALUES ($1,$2,$3) `,[userId,url,shortUrl])

        let urlId = await db.query(`SELECT * FROM urls WHERE short_url = $1`,[shortUrl])

        urlId = urlId.rows[0].id

        const urlObj = {
            id:urlId,
            shortUrl
        }

        return res.status(201).send(urlObj)
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function getUrl(req,res){

    const {id} = req.params

    try {

        let findUrl = await db.query(`SELECT * FROM urls WHERE id = $1`,[id])

        if(findUrl.rows.length === 0) return res.sendStatus(404)

        findUrl = findUrl.rows[0]

        const urlObj = {
            id:findUrl.id,
            shortUrl:findUrl.short_url,
            url:findUrl.url
        }

        res.status(200).send(urlObj)
        
    } catch (error) {

        res.status(500).send(error.message)
    }
}

export async function openShortUrl(req,res){

    const {shortUrl} = req.params

    try {

        let findShortUrl = await db.query(`SELECT * FROM urls WHERE short_url = $1`,[shortUrl])

        if(findShortUrl.rows.length === 0) return res.sendStatus(404)

        findShortUrl = findShortUrl.rows[0]

        let visitsCount = findShortUrl.visits_count

        visitsCount = visitsCount + 1

        await db.query(`UPDATE urls SET visits_count = $1 WHERE short_url = $2`,[visitsCount,shortUrl])

        res.redirect(`${findShortUrl.url}`)

        
    } catch (error) {

        res.status(500).send(error.message)

    }
}

export async function deleteShortUrl(req,res){

    const {id} = req.params

    const token = res.locals.session

    try {

        const userIdFromToken = await db.query(`SELECT * FROM sessions WHERE token = $1`,[token])

        const userIdFromUrl = await db.query(`SELECT * FROM urls WHERE id = $1`,[id])

        if(userIdFromUrl.rows.length === 0) return res.sendStatus(404)

        if(userIdFromToken.rows[0].user_id !== userIdFromUrl.rows[0].user_id) return res.sendStatus(401)

        await db.query(`DELETE FROM urls WHERE id = $1`,[id])

        res.sendStatus(204)
        
    } catch (error) {

        res.status(500).send(error.message)

    }
}