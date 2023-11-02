import { Calendar, Folder, LogOut, Settings, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { BiStats, BiTask } from "react-icons/bi"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { signOut } from "next-auth/react"

// TODO: change the spans to a links that redirect to the appropriate view
const ProfileDropDown = ({ username }: { username: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback className="cursor-pointer">{username[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-zinc-700">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BiTask className="mr-2 w-4 h-4" />
            <span>Tasks</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BiStats className="mr-2 h-4 w-4" />
            <span>Stats</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="mr-2 w-4 h-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropDown
