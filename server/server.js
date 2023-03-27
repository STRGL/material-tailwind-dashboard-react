import * as dotenv from 'dotenv'
import express from 'express'

import apiRoutes from './index.js'

dotenv.config()

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.get("/", (req, res) => {
  res.send('Welcome to the route of the Express server.');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`)
})

