import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from "lucide-react"
import { BsExclamation } from "react-icons/bs"

import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import { Separator } from "~/components/ui/separator"
import { authOptions } from "~/server/auth"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from '~/lib/utils'
import { Calendar } from '~/components/ui/calendar'
import { api } from "~/utils/api"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

// this is the formschema that will define the rules and fields of the form
export const formSchema = z.object({
  title: z.string()
    .min(5,
      { message: 'The title must be at least 5 chars.' })
    .max(40,
      { message: 'The title must be at most 20 chars.' }),
  memo: z.string()
    .min(3,
      { message: 'The memo must be at least 3 chars.' })
    .max(60,
      { message: 'The memo must be at most 40 chars.' }),
  deadline: z.date(
    {
      required_error: 'A deadline is required.',
      invalid_type_error: "That's not a valid date."
    }
  )
})

const TaskAdd = () => {
  const { data: sessionData } = useSession()
  // define the task mutation to create the task
  const taskMutation = api.task.create.useMutation()

  // we use the schema we defined to check and define the form
  // to check and get the values of our form
  // and we define the default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      memo: '',
      deadline: new Date()
    }
  })

  // we use the mutation to create the task in the db using trpc
  function onSubmit(values: z.infer<typeof formSchema>) {
    taskMutation.mutate(values)
  }

  if (sessionData != null) {
    return (
      <>
        <Head>
          <title>TimeWise | Add task</title>
          <meta name="description" content="Add a new task to your existing ones." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen">
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <main className="space-y-6 my-16">
            <div>
              <h3 className="text-lg font-medium">Add a task</h3>
              <p className="text-sm text-muted-foreground">
                Add your task title, define a small memo and set the deadline.
              </p>
            </div>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit" className={`${taskMutation.isLoading && 'transition-all duration-150 bg-gradient-to-r from-pink-500 to-yellow-500'}`}>Submit</Button>
                {
                  // if the mutation returned an error 
                  // we display an alert with the error
                  // message
                  taskMutation.error &&
                  <Alert variant='destructive'>
                    <BsExclamation className="h-4 w-4" />
                    <AlertTitle>An error occured</AlertTitle>
                    <AlertDescription>
                      {taskMutation.error.message}
                    </AlertDescription>
                  </Alert>
                }
                {
                  // if the mutation succeeded we display that the task has been created
                  // in the db
                  taskMutation.isSuccess &&
                  <Alert>
                    <BsExclamation className="h-4 w-4" />
                    <AlertTitle>Task Insertion</AlertTitle>
                    <AlertDescription>
                      {form.getValues('title')} added successfully.
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

export default TaskAdd

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
