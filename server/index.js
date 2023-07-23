import express from "express"
import musicRoutes from "./music/index.js"

const app = express()

app.use("/music", musicRoutes)

export default app
