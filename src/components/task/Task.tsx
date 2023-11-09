import type { Task as TaskType } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from '~/components/ui/button'
import { Trash } from "lucide-react"
import { api } from "~/utils/api"

const Task = ({ data }: { data: TaskType }) => {
  // Create the mutation to delete the tasks
  const deleteMutation = api.task.delete.useMutation()
  // we will need this to refresh the tasks in the front end because it deletes in the backend
  // but it doesnt update the frontend, creating a state would just be more tedious and painful
  const utils = api.useUtils()

  // the function to call to delete the button using the id passed in the prop
  const deleteTask = () => {
    deleteMutation.mutate({ id: data.id }, {
      onSuccess: () => {
        // invalidate the tasks so that trpc refresh and refetch them to update the frontend
        utils.task.invalidate()
      }
    })

  }

  return (
    <div className="py-1 w-full space-y-1">
      {/* if the mutation is still deleting display a hint message */}
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
