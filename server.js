import * as dotenv from 'dotenv'
import express from 'express' 
import queryString from 'querystring'
import crypto from 'crypto'
import axios from 'axios'

dotenv.config()

const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${port}/callback`

const stateKey = 'spotify_auth_state'

app.get('/', (req, res) => {
    const data = {
        name: 'Daryll',
        age: 'too old'
    }

    res.json(data)
})

app.get('/login', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex')
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email'

    const queryParams = queryString.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scope
    })

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
})

app.get('/callback', async (req, res) => {
    try {
        const code = req.query.code || null;
    
        const response = await axios({
            method: 'post',
            url: 'https://account.spotify.com/api/token',
            data: queryString.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
            }
        })

        if(response.status === 200) {
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        } else {
            res.send(response);
        }

    } catch (error) {
        res.send(error);
    }
})

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
})
