import * as dotenv from 'dotenv'
import express from "express";
import queryString from 'querystring'
import crypto from 'crypto'
import axios from 'axios'

dotenv.config()
const app = express();

const PORT = process.env.SERVER_PORT

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/api/music/spotify/callback`;

const stateKey = "spotify_auth_state";
const scopes = ["user-read-private", "user-read-email"];

app.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie(stateKey, state);

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: scopes.join(" "),
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code || null;

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryString.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;

      const queryParams = queryString.stringify({
        access_token, 
        refresh_token
      });

      res.redirect(`http://localhost:5173/dashboard/music/?${queryParams}`)

    } else {
      res.redirect(`/?${queryString.stringify({error: 'invalid_token'})}`);
    }
  } catch (error) {
    res.send(error);
  }
});

app.get("/refresh_token", async (req, res) => {
  console.log('REFRESH TOKEN REQ')
  try {
    const { refresh_token } = req.query;

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryString.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

export default app;