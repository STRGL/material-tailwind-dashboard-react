import { useEffect, useState } from "react"
import { Button } from "@material-tailwind/react"
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylists } from "@/helpers/spotify"
import MusicProfileCard from "@/widgets/cards/MusicProfileCard"

export function Music() {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)

  useEffect(() => {
    setToken(accessToken)

    async function fetchData() {
      try {
        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile.data)
        const userPlaylists = await getCurrentUserPlaylists()
        setPlaylists(userPlaylists.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {!token ? (
        <a className="App-link" href="/api/music/spotify/login">
          <Button color="green">Log in to Spotify</Button>
        </a>
      ) : (
        profile && playlists && <MusicProfileCard profile={profile} playlistCount={playlists.total} logout={logout} />
      )}
    </main>
  )
}

export default Music
