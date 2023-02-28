import {db} from "../config/database.js"

export async function authValidation(req, res, next) {

  const { authorization } = req.headers

  const token = authorization?.replace("Bearer ", '')

  if (!token) return res.sendStatus(422)

  try {
    let checkSession = await db.query(`SELECT * FROM sessions WHERE token = $1`,[token])

    if (checkSession.rows.length === 0) return res.sendStatus(401)

    res.locals.session = checkSession.rows[0].token

    next()

  } catch (error) {
    res.status(500).send(error)
  }
}