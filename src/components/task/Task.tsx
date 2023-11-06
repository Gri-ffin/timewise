import type { Task as TaskType } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from '~/components/ui/button'
import { Trash } from "lucide-react"

const Task = ({ data }: { data: TaskType }) => {
  // TODO: write the function to delete the task based on id
  const deleteTask = () => {
    console.log('Working');

  }

  return (
    <div className="py-1 w-full space-y-1">
      <div className="flex flex-row items-center justify-between">
        <h3 className="capitalize font-semibold">{data.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>. . .</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mx-5">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Trash className="w-4 h-4 mr-2" />
                <span className="cursor-pointer" onClick={deleteTask}>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-gray-500">{data.memo}</p>
    </div>
  )
}

export default Task
