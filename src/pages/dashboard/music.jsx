import { useEffect, useState } from "react"
import { Button } from "@material-tailwind/react"
import { accessToken, logout, getCurrentUserProfile } from "@/helpers/spotify"

export function Music() {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setToken(accessToken)

    async function fetchData() {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <header>
      {!token ? (
        <a className="App-link" href="http://localhost:8888/api/music/spotify/login">
          Log in to Spotify
        </a>
      ) : (
        <>
          <h1>Music Page</h1>
          <Button onClick={logout}>Logout</Button>
          {profile && (
            <div className="mb-4 mt-2 h-20 w-80 rounded p-2">
              <h3>{profile.display_name}</h3>
              <p>{profile.product}</p>
              <p>{profile.followers.total}</p>
            </div>
          )}
        </>
      )}
    </header>
  )
}

export default Music
