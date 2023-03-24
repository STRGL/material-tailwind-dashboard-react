import * as dotenv from 'dotenv'
import express from 'express'
import spotify from './server/music/spotify.js'

dotenv.config()

const app = express();
const PORT = process.env.SERVER_PORT

console.log('PORT: ', PORT)

app.get("/", (req, res) => {
    const data = {
      name: "Daryll",
      age: "too old",
    };

    res.json(data);
  });

app.use(spotify);


app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`)
})

