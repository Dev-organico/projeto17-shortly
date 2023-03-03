import {db} from "../config/database.js"
import { nanoid } from 'nanoid'

export async function shorten(req, res) {

    const {url} = req.body

    const token = res.locals.session

    const shortUrl =  nanoid()

    try {

        const findId = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token])

        const userId = findId.rows[0].user_id

        await db.query(`INSERT INTO urls (user_id,url,"shortUrl") VALUES ($1,$2,$3) `,[userId,url,shortUrl])

        let urlId = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`,[shortUrl])

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
            shortUrl:findUrl.shortUrl,
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

        let findShortUrl = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`,[shortUrl])

        if(findShortUrl.rows.length === 0) return res.sendStatus(404)

        findShortUrl = findShortUrl.rows[0]

        let visitCount = findShortUrl.visitCount

        visitCount = visitCount + 1

        await db.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`,[visitCount,shortUrl])

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

export async function getUser(req,res){

    const token = res.locals.session

    try {

        const getIdFromToken = await db.query(`SELECT * FROM sessions WHERE token = $1`,[token])

        const userId = getIdFromToken.rows[0].user_id

        const myData = await db.query(`
        SELECT users.id , users.name ,
        SUM(urls."visitCount") AS "visitCount",
        json_agg(json_build_object('id', urls.id, 'shortUrl', urls."shortUrl", 'url', urls.url, 'visitCount', urls."visitCount")) AS "shortenedUrls" 
        FROM users
        JOIN urls
            ON users.id = urls.user_id
        WHERE urls.user_id = $1 and users.id = $2
        GROUP BY users.id
        ;
        `,[userId,userId])

        return res.status(200).send(myData.rows[0])

        
    } catch (error) {

        res.status(500).send(error.message)

    }
}

export async function getRanking(req,res){

    try {
        
        const showRanking = await db.query(``)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

