import React from "react"
import { Button, Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react"

function MusicProfileCard({ profile, playlistCount, logout }) {
  return (
    <Card className="w-48 p-2">
      <CardHeader shadow={false} className="mt-0 flex flex-col items-center">
        {profile.images.length && profile.images[0].url && (
          <Avatar
            size="xl"
            src={profile.images[0].url}
            alt="Avatar"
            variant="circular"
            className="mb-2 border-2 border-green-500"
          />
        )}
        <Typography className="rounded bg-black p-1 px-4 text-xs text-green-500">
          {profile.product.toUpperCase()}
        </Typography>
      </CardHeader>
      <CardBody className="p-4 text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {profile.display_name}
        </Typography>
        <Typography>
          <b className="font-bold">{profile.followers.total}</b> Followers
        </Typography>
        {playlistCount && (
          <Typography>
            <b className="font-bold">{playlistCount}</b> Playlist{playlistCount !== 1 ? "s" : ""}
          </Typography>
        )}
      </CardBody>
      <Button className="mt-2" onClick={logout} color="green">
        Logout
      </Button>
    </Card>
  )
}

export default MusicProfileCard
