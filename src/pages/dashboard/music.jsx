import React, { useEffect } from "react";

export function Music() {
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        
        console.log("🚀 ~ file: music.jsx:8 ~ useEffect ~ accessToken:", accessToken)
        console.log("🚀 ~ file: music.jsx:9 ~ useEffect ~ refreshToken:", refreshToken)

    }, [])


  return (
    <a className="App-link" href="http://localhost:8888/login">
          Log in to Spotify
    </a>
  );
}

export default Music;
