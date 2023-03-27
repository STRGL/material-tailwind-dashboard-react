import React, { useEffect } from "react";

export function Music() {
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
                
        
          if(refreshToken) {
            fetch(`/api/music/spotify/refresh_token?refresh_token=${refreshToken}`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
          }
    }, []);

  return (
    <React.Fragment>
      <a className="App-link" href="http://localhost:8888/api/music/spotify/login">
            Log in to Spotify
      </a>
    </React.Fragment>
  );
}

export default Music;
