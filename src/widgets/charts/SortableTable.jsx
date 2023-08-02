import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { PlayIcon, UserPlusIcon } from "@heroicons/react/24/solid"
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react"

function SortableTable({ title = "Table", description = "", data }) {
  const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Public",
      value: "public",
    },
    {
      label: "Private",
      value: "private",
    },
  ]

  const TABLE_HEAD = ["Play?", "Name", "Tracks", "Private?", "Type"]

  const TABLE_ROWS = data.items

  return (
    <Card className="h-[500px] w-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {title}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {description}
              {"\n"}
              {data.total} {data.total > 1 ? "items" : "item"}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" color="blue-gray" size="sm">
              view all
            </Button>
            <Button className="flex items-center gap-3" color="blue" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {tabs.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head} {index !== 0 && <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ description, name, href, images, public: publicPlaylist, tracks, type }, index) => {
              const isLast = index === TABLE_ROWS.length - 1
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50"

              return (
                <tr key={name}>
                  <td className={classes}>
                    <Tooltip content="Play">
                      <IconButton variant="text" color="blue-gray">
                        <PlayIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar src={images[0].url} alt={name} size="sm" />
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {name}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {tracks.total}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        variant="filled"
                        size="sm"
                        value={publicPlaylist ? "PUBLIC" : "PRIVATE"}
                        color={publicPlaylist ? "green" : "red"}
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {type}
                    </Typography>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of {Math.ceil(data.total / data.limit)}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" color="blue-gray" size="sm" disabled={!data.previous}>
            Previous
          </Button>
          <Button variant="outlined" color="blue-gray" size="sm" disabled={!data.next}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default SortableTable
