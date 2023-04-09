import { useEffect, useState } from "react";
import {
  accessToken,
  logout,
  getCurrentUserProfile,
} from "@/helpers/spotify.js";
import { Button } from "@material-tailwind/react";

export function Music() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    async function fetchData() {
      try {
        const { data } = await getCurrentUserProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchData();
  }, []);

  return (
    <>
      <header>
        {!token ? (
          <a
            className="App-link"
            href="http://localhost:8888/api/music/spotify/login"
          >
                        Log in to Spotify
          </a>
        ) : (
          <>
            <h1>Music Page</h1>
            <Button onClick={logout}>Logout</Button>
            {profile && (
              <div
                className={`bg-[url(${profile.images[0].url})]`}
              >
                <h3>{profile.display_name}</h3>
                <p>{profile.product}</p>
                <p>{profile.followers.total}</p>
              </div>
            )}
          </>
        )}
      </header>
    </>
  );
}

export default Music;
