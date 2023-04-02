import React, { useEffect, useState } from 'react'
import { accessToken } from '@/helpers/spotify.js'

export function Music () {
  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(accessToken)
  }, [])

  return (
    <React.Fragment>
      <header>
        {!token
          ? (
          <a
            className="App-link"
            href="http://localhost:8888/api/music/spotify/login"
          >
            Log in to Spotify
          </a>
            )
          : (
          <h1>Music Page</h1>
            )}
      </header>
    </React.Fragment>
  )
}

export default Music
