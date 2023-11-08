import type { Task as TaskType } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from '~/components/ui/button'
import { Trash } from "lucide-react"
import { api } from "~/utils/api"

const Task = ({ data }: { data: TaskType }) => {
  const deleteMutation = api.task.delete.useMutation()
  const utils = api.useUtils()

  const deleteTask = () => {
    deleteMutation.mutate({ id: data.id }, {
      onSuccess: () => {
        utils.task.invalidate()
      }
    })

  }

  return (
    <div className="py-1 w-full space-y-1">
      {deleteMutation.isLoading ? <h3 className="font-semibold">Deleting . . .</h3> :
        <>
          <div className="flex flex-row items-center justify-between">
            <h3 className="capitalize font-semibold">{data.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost'>. . .</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mx-5">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={deleteTask} className="cursor-pointer">
                    <Trash className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-500">{data.memo}</p>
        </>
      }
    </div>
  )
}

export default Task
