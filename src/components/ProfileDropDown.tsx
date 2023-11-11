import { Calendar, Folder, LogOut, Plus, Settings, User } from "lucide-react"
import { BiFile, BiStats, BiTask } from "react-icons/bi"
import { signOut } from "next-auth/react"
import Link from 'next/link'

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

// TODO: change the spans to a links that redirect to the appropriate view
// this is the menu that the user can choose to quickly navigate
const ProfileDropDown = ({ username, imgUrl }: { username: string, imgUrl: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={imgUrl} className="cursor-pointer" />
          <AvatarFallback className="cursor-pointer">{username[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Profile Section */}
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* Task Section */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <BiTask className="mr-2 h-4 w-4" />
              <span>Tasks</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <Link href='/dashboard/task/add' >
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add</span>
                  </DropdownMenuItem>
                </Link>
                <Link href='/dashboard/task'>
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <BiFile className="mr-2 h-4 w-4" />
                    <span>List</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* Projects Section */}
          <DropdownMenuItem>
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Calendar Section */}
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
          {/* Stats Section */}
          <DropdownMenuItem>
            <BiStats className="mr-2 h-4 w-4" />
            <span>Stats</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Settings Section */}
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {/* Sign out section */}
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
