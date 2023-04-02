import express from 'express'

import spotifyRoutes from './spotify.js'

const app = express()

app.use('/spotify', spotifyRoutes)

export default app
