import { useState } from "react"
import type { Prisma } from "@prisma/client"
import { CalendarIcon, Pen, Trash, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from 'date-fns'
import { z } from "zod"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from '~/lib/utils'
import { Calendar } from '~/components/ui/calendar'
import { taskFormSchema } from "~/utils/task/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from '~/components/ui/button'
import { api } from "~/utils/api"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getGroupIcon } from "~/utils/helpers"

type Data = Prisma.TaskGetPayload<{ include: { Group: true } }>

const Task = ({ data }: { data: Data }) => {
  // close the dialog when the task is updated
  const [open, setOpen] = useState<boolean>(false)
  // Create the mutation to delete the tasks
  const deleteMutation = api.task.delete.useMutation()
  // Create the update muation to update the task
  const updateMutation = api.task.update.useMutation()
  // get all the groups that belongs to a user
  const groupQuery = api.group.getAll.useQuery()
  // the handle done status mutation
  const doneStatusMutation = api.task.changeStatusDone.useMutation()
  // we use the schema we defined to check and define the form
  // to check and get the values of our form
  // and we define the default values
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: data.title,
      memo: data.memo,
      deadline: data.deadline,
      groupId: data.groupId ? data.groupId.toString() : 'null'
    }
  })

  // we use the mutation to create the task in the db using trpc
  function updateTask(values: z.infer<typeof taskFormSchema>) {
    let groupId: number | undefined;
    if (values.groupId !== "null") {
      groupId = Number(values.groupId)
    } else {
      groupId = undefined
    }
    const updateTaskValues = { ...values, groupId, id: data.id }
    console.log(updateTaskValues);

    updateMutation.mutate(updateTaskValues, {
      onSuccess: () => {
        // refresh the task array to update the front
        utils.task.invalidate()
        // close the dialog
        setOpen(false)
      }
    })
  }
  // we will need this to refresh the tasks in the front end because it deletes in the backend
  // but it doesnt update the frontend, creating a state would just be more tedious and painful
  const utils = api.useUtils()

  // if the user check the box we set the task to done = true else we set done to false in db
  const handleCheckBoxChange = (event: boolean) => {
    const done = event
    doneStatusMutation.mutate({ id: data.id, done }, {
      onSuccess: () => {
        // invalidate the tasks so that trpc refresh and refetch them to update the frontend
        utils.task.invalidate()
      }
    })
  }

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
            <div className="flex items-center justify-center space-x-3">
              <Checkbox defaultChecked={data.done} onCheckedChange={handleCheckBoxChange} id="task" disabled={doneStatusMutation.isLoading} />
              <label className="capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold" htmlFor="task">{data.title}</label>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost'>. . .</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mx-5">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={deleteTask} className="cursor-pointer">
                      <Trash className="w-4 h-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pen className="w-4 h-4 mr-2" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                  <DialogDescription>
                    Make changes to your task here. Click save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(updateTask)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="The task title..." {...field} />
                          </FormControl>
                          <FormDescription>
                            How about a nice and descriptive title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Memo</FormLabel>
                          <FormControl>
                            <Input placeholder="The task memo..." {...field} />
                          </FormControl>
                          <FormDescription>
                            A short and good description would be nice.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    {
                      !groupQuery.isLoading && groupQuery.data!.length > 0 &&
                      <FormField
                        control={form.control}
                        name="groupId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select group or leave empty. . .' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {groupQuery.data?.map(group => {
                                  let Icon = getGroupIcon(group.icon)
                                  return (
                                    <SelectItem className="items-center flex" key={group.id} value={group.id.toString()}><Icon className="inline mr-4" /> {group.name}</SelectItem>
                                  )
                                })}
                                <SelectItem value="null" className="items-center flex"><X className="inline mr-4" /> No Group</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />}
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Deadline</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  // if the date is inferior to today we disable that date so
                                  // that the user can't choose
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            You should set a deadline for your task.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* if there is an error show the message in the dialog */}
                    {updateMutation.error && <DialogDescription className="text-red-400">{updateMutation.error.message}</DialogDescription>}
                    <DialogFooter>
                      <Button type="submit" className={`${updateMutation.isLoading && 'transition-all duration-150 bg-gradient-to-r from-pink-500 to-yellow-500'}`}>Submit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {data.Group ?
            <p className="italic text-sm text-muted-foreground py-1 font-semibold">Belongs to {data.Group.name}</p> :
            <p className="italic text-sm text-muted-foreground py-1 font-semibold">Belongs to No Group</p>
          }
          <p className="text-gray-300/80 font-semibold">Memo: <span className="text-zinc-500/90 font-medium">{data.memo}</span></p>
        </>
      }
    </div>
  )
}

export default Task
