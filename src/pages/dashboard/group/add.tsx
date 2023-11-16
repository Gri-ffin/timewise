import { zodResolver } from "@hookform/resolvers/zod"
import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Folder, Star, File, Flag, Power } from "lucide-react"

import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import { Separator } from "~/components/ui/separator"
import { authOptions } from "~/server/auth"
import { groupTaskSchema } from "~/utils/group/types"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import IconEnum from '~/utils/group/types'
import { Button } from '~/components/ui/button'
import { api } from "~/utils/api"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { BsExclamation } from "react-icons/bs"

const GroupAdd = () => {
  const { data: sessionData } = useSession()
  // the mutation for creating a new group
  const groupMutation = api.group.create.useMutation()

  // we use the schema we defined to check and define the form
  // to check and get the values of our form
  // and we define the default values
  const form = useForm<z.infer<typeof groupTaskSchema>>({
    resolver: zodResolver(groupTaskSchema),
    defaultValues: {
      name: '',
      icon: IconEnum.enum.Folder
    }
  })

  // we use the mutation to create the group in the db using trpc
  function onSubmit(values: z.infer<typeof groupTaskSchema>) {
    groupMutation.mutate(values)
  }

  if (sessionData != null) {
    return (
      <>
        <Head>
          <title>TimeWise | Add Group</title>
          <meta name="description" content="Add a new Group to manage your tasks." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <main className="space-y-6 my-16">
            <div>
              <h3 className="text-lg font-medium">Add a Group</h3>
              <p className="text-sm text-muted-foreground">
                Add your Group name, choose a good and memorable icon to group your tasks.
              </p>
            </div>
            <Separator />
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
                      <Select onValueChange={field.onChange} defaultValue={IconEnum.enum.Folder}>
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
                <Button type="submit" className={`${groupMutation.isLoading && 'transition-all duration-150 bg-gradient-to-r from-pink-500 to-yellow-500'}`} variant='outline'>Submit</Button>
                {
                  // if the mutation returned an error 
                  // we display an alert with the error
                  // message
                  groupMutation.error &&
                  <Alert variant='destructive'>
                    <BsExclamation className="h-4 w-4" />
                    <AlertTitle>An error occured</AlertTitle>
                    <AlertDescription>
                      {groupMutation.error.message}
                    </AlertDescription>
                  </Alert>
                }
                {
                  // if the mutation succeeded we display that the group has been created
                  // in the db
                  groupMutation.isSuccess &&
                  <Alert>
                    <BsExclamation className="h-4 w-4" />
                    <AlertTitle>Task Insertion</AlertTitle>
                    <AlertDescription>
                      {form.getValues('name')} added successfully.
                    </AlertDescription>
                  </Alert>
                }
              </form>
            </Form>
          </main>
        </div>
      </>
    )
  }
  return <AccessDenied />
}

export default GroupAdd

// we prefetch the session to check if the user is logged in or not
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      )
    }
  }

}
