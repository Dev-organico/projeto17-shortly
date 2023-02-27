import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import {db} from "../config/database.js"


export async function signUp(req, res) {

    const { name, email, password } = req.body

    const passwordHashed = bcrypt.hashSync(password, 10)


    try {

        const isIncluded = await db.query(`SELECT * FROM users WHERE email = $1`,[email])

        console.log(isIncluded.rows)

        if (isIncluded.rows.length > 0) return res.status(409).send("Esse e-mail já está cadastrado.")

        await db.query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$2)`,[name,email,passwordHashed])

        res.status(201).send("Usuário cadastrado com sucesso!")


    } catch (err) {
        res.status(500).send(err)

    }


}

export async function signIn(req, res) {

    const { email, password } = req.body

    try {

        let checkUser = await db.query(`SELECT * FROM users WHERE email = $1`,[email])

        if (checkUser.rows.length === 0) return res.status(401).send("Usuário ou senha incorretos")

        checkUser = checkUser.rows[0]

        const userId = checkUser.id

        const isCorrectPassword = bcrypt.compareSync(password, checkUser.password)

        if (!isCorrectPassword) return res.status(401).send("Usuário ou senha incorretos")

        const token = uuidV4()

        await db.query(`INSERT INTO sessions (user_id,token) VALUES ($1,$2) `,[userId,token])

        const tokenObj = { token }

        return res.status(200).send(tokenObj)


    } catch (err) {

        res.status(500).send(err.message)

    }

}