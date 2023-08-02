/* eslint-disable new-cap */
import * as dotenv from "dotenv"
import express from "express"
import queryString from "querystring"
import crypto from "crypto"
import axios from "axios"

dotenv.config()
const app = express()

const PORT = process.env.SERVER_PORT

const { CLIENT_ID } = process.env
const { CLIENT_SECRET } = process.env
const REDIRECT_URI = `http://localhost:${PORT}/api/music/spotify/callback`

const stateKey = "spotify_auth_state"
const scopes = ["user-read-private", "user-read-email", "playlist-read-private"]

app.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex")
  res.cookie(stateKey, state)

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: scopes.join(" "),
  })

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
})

app.get("/callback", async (req, res) => {
  try {
    console.log("CALLBACK FUNCTION")
    const code = req.query.code || null

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryString.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
    })

    if (response.status === 200) {
      // eslint-disable-next-line camelcase
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = response.data

      const queryParams = queryString.stringify({
        accessToken,
        refreshToken,
        expiresIn,
      })
      res.redirect(`http://localhost:5173/dashboard/music/?${queryParams}`)
    } else {
      res.redirect(`/?${queryString.stringify({ error: "invalid_token" })}`)
    }
  } catch (error) {
    res.send(error)
  }
})

app.get("/refreshToken", async (req, res) => {
  console.log("REFRESH TOKEN REQ") // eslint-disable-line no-console
  try {
    const { refresh_token } = req.query // eslint-disable-line camelcase

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryString.stringify({
        grant_type: "refresh_token",
        refresh_token, // eslint-disable-line camelcase
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
    })

    console.log("SENDING DATA") // eslint-disable-line no-console
    res.send(response.data)
  } catch (error) {
    console.log("SENDING ERROR") // eslint-disable-line no-console
    res.status(error.response.status).send(error)
  }
})

export default app
