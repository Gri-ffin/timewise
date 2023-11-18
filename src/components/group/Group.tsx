import { useState } from "react";
import { Prisma } from "@prisma/client";
import { Flag, Folder, Pen, Power, Star, Trash, File } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getGroupIcon } from "~/utils/helpers";
import { groupTaskSchema } from "~/utils/group/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from '~/components/ui/button'
import { Input } from "../ui/input";
import IconEnum from '~/utils/group/types'

type Data = Prisma.GroupGetPayload<{ include: { Task: true } }>

interface DataIcon {
  icon: "Star" | "Folder" | "File" | "Flag" | "Power" | undefined;
}

// TODO: add edit and delete mutations
const Group = ({ data }: { data: Data }) => {
  // close the dialog when the task is updated
  const [open, setOpen] = useState<boolean>(false)

  // we use the schema we defined to check and define the form
  // to check and get the values of our form
  // and we define the default values
  const form = useForm<z.infer<typeof groupTaskSchema>>({
    resolver: zodResolver(groupTaskSchema),
    defaultValues: {
      name: data.name,
      icon: data.icon as DataIcon["icon"]
    }
  })
  // we use the mutation to create the group in the db using trpc
  function onSubmit(values: z.infer<typeof groupTaskSchema>) {
    console.log(values);
    // groupMutation.mutate(values)
  }

  let Icon = getGroupIcon(data.icon)

  return (
    <div className="py-1 w-full space-y-1">
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex items-center justify-center space-x-3">
          <Icon />
          <label className="capitalize font-semibold">{data.name}</label>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost'>. . .</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mx-5">
              <DropdownMenuGroup>
                <DropdownMenuItem /* onClick={deleteTask} */ className="cursor-pointer">
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
              <DialogTitle>Edit Group</DialogTitle>
              <DialogDescription>
                Make changes to your group here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="The group name. . ." />
                      </FormControl>
                      <FormDescription>
                        Define a name for your group.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon. . ." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={IconEnum.enum.Folder}><Folder /></SelectItem>
                          <SelectItem value={IconEnum.enum.Star}><Star /></SelectItem>
                          <SelectItem value={IconEnum.enum.File}><File /></SelectItem>
                          <SelectItem value={IconEnum.enum.Flag}><Flag /></SelectItem>
                          <SelectItem value={IconEnum.enum.Power}><Power /></SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" /* className={`${updateMutation.isLoading && 'transition-all duration-150 bg-gradient-to-r from-pink-500 to-yellow-500'}`}*/>Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-gray-300/80 font-semibold">Number of assigned tasks: <span className="text-zinc-500/90 font-medium">{data.Task.length}</span></p>
    </div>
  )
}

export default Group
