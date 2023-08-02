import { useEffect, useState } from "react"
import { Button } from "@material-tailwind/react"
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylists } from "@/helpers/spotify"
import MusicProfileCard from "@/widgets/cards/MusicProfileCard"
import SortableTable from "@/widgets/charts/SortableTable"

export function Music() {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setToken(accessToken)

    async function fetchData() {
      if (token) {
        try {
          const userProfile = await getCurrentUserProfile()
          setProfile(userProfile.data)
          const userPlaylists = await getCurrentUserPlaylists()
          setPlaylists(userPlaylists.data)
        } catch (errorMessage) {
          console.error(errorMessage) // eslint-disable-line no-console
          setError(errorMessage)
        }
      }
    }
    fetchData()
  }, [token])

  return (
    <main className="grid auto-cols-auto grid-flow-row gap-4">
      {!token ? (
        <a className="App-link" href="/api/music/spotify/login">
          <Button color="green">Log in to Spotify</Button>
        </a>
      ) : (
        profile && playlists && <MusicProfileCard profile={profile} playlistCount={playlists.total} logout={logout} />
      )}
      {playlists && <SortableTable description="A table of users playlists" data={playlists} title="Playlists" />}
    </main>
  )
}

export default Music
