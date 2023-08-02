/* eslint-disable no-console */
import axios from "axios"
import * as dayjs from "dayjs"

const dbg = true

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
}

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
}

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  if (dbg) console.debug("hasTokenExpired Running")

  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES
  if (!accessToken || !timestamp) {
    if (dbg) console.debug("hasTokenExpired found no token. Returned", false)
    return false
  }

  const now = dayjs()
  const timestampFormatted = dayjs(Number(timestamp))

  if (dbg) console.debug("hasTokenExpired returned", timestampFormatted.add(Number(expireTime), "seconds") < now)
  return timestampFormatted.add(Number(expireTime), "seconds") < now
}

/**
 ** Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = (refreshPage = true) => {
  if (dbg) console.debug("logout Running")

  // Clear all localStorage items
  Object.keys(LOCALSTORAGE_KEYS).forEach((key) => window.localStorage.removeItem(LOCALSTORAGE_KEYS[key]))
  if (refreshPage) {
    window.location = window.location.origin + window.location.pathname
  }
}

/**
 ** Use the refresh token in localStorage to hit the /refresh_token endpoint
 ** in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
async function refreshToken() {
  if (dbg) console.debug("refreshToken Running")
  try {
    if (!LOCALSTORAGE_VALUES.refreshToken || LOCALSTORAGE_VALUES.refreshToken === "undefined") {
      console.debug("No refresh token available. Logging user out")
      logout()
    }

    const response = await axios.get(
      `/api/music/spotify/refreshToken?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    )

    if (dbg) console.debug("refreshToken returned", response)

    if (response?.data?.access_token) {
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, response.data.access_token)
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())
      window.localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, response.data.expires_in)
    }
  } catch (e) {
    console.error(e)
    logout()
  }
}

/**
 ** Handles logic for retrieving the Spotify access token from localStorage
 ** or URL query params
 * @returns {string} A Spotify access token
 */
function getAccessToken() {
  if (dbg) console.debug("getAccessToken Running")
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("accessToken"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refreshToken"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expiresIn"),
  }
  if (dbg) console.debug("Got the following from the query Params", queryParams)

  const hasError = urlParams.get("error")

  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === "undefined") {
    if (dbg) console.debug("getAccessToken called refreshToken")
    Object.keys(LOCALSTORAGE_KEYS).forEach((key) => {
      if (key !== "refreshToken") {
        if (dbg)
          console.debug(
            `Removing ${LOCALSTORAGE_KEYS[key]} with value ${queryParams[LOCALSTORAGE_KEYS[key]]} from localStorage`,
          )
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[key])
      }
    })
    refreshToken()
  }

  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== "undefined") {
    if (dbg) console.debug("getAccessToken returned from localStorage", LOCALSTORAGE_VALUES.accessToken)
    return LOCALSTORAGE_VALUES.accessToken
  }

  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    if (dbg) console.debug("getAccessToken found in localStorage")
    Object.keys(LOCALSTORAGE_KEYS).forEach((key) => {
      if (dbg)
        console.debug(
          `Setting ${LOCALSTORAGE_KEYS[key]} with value ${queryParams[LOCALSTORAGE_KEYS[key]]} in localStorage`,
        )
      window.localStorage.setItem(LOCALSTORAGE_KEYS[key], queryParams[LOCALSTORAGE_KEYS[key]])
    })

    if (dbg) console.debug("Setting localStorage timestamp with value", Date.now(), new Date())
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())
    window.location.search = ""

    if (dbg)
      console.debug(
        "getAccessToken found in queryParams",
        queryParams[LOCALSTORAGE_KEYS.accessToken],
        `at ${new Date()}`,
      )
    return queryParams[LOCALSTORAGE_KEYS.accessToken]
  }

  return false
}

export const accessToken = getAccessToken()

axios.defaults.baseURL = "https://api.spotify.com/v1"
axios.defaults.headers.Authorization = `Bearer ${accessToken}`
axios.defaults.headers["Content-Type"] = "application/json"

/**
 ** Get Current User's Profile
 ** https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUserProfile = () => axios.get("/me")

/**
 ** Get a List of Current User's Playlists
 ** https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => axios.get(`/me/playlists?limit=${limit}`)
