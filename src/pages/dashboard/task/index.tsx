import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Link from 'next/link'

import dayjs from 'dayjs'

import DateNavigationMenu from "~/components/task/DateNavigationMenu"
import { authOptions } from "~/server/auth"
import { Button } from "~/components/ui/button"
import { TextIcon } from "lucide-react"
import Head from "next/head"
import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import { api } from "~/utils/api"
import Task from "~/components/task/Task"

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TaskPage = () => {
  const { data: sessionData } = useSession()
  const tasks = api.task.getTasks.useQuery();
  console.log(tasks.data);


  let now = dayjs()
  const currentDay = days[now.day()]
  const currentDate = now.format('MMM DD, YYYY')

  if (sessionData !== null) {
    return (
      <>
        <Head>
          <title>TimeWise | Tasks Lists</title>
          <meta name="description" content="Add tasks and view them based on day, week, month or year." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen">
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <main>
            <div className="flex items-center justify-center my-5">
              <DateNavigationMenu />
            </div>
            <section className="my-14">
              <h3 className="text-3xl text-center">{currentDay}</h3>
              <p className="text-slate-500 text-center my-4">{currentDate}</p>
              <Link href='/dashboard/task/add'>
                <Button className="w-full justify-start" variant='outline'>
                  <TextIcon className="mr-2 h-4 w-4" /> Add a task...
                </Button>
              </Link>
              {tasks.isLoading ?
                <div className="flex flex-col items-center justify-center mt-44">
                  <p className="text-xl">Loading. . .</p>
                </div> :
                <div className="space-y-4 mt-5 divide-y">
                  {tasks.data?.map(task => {
                    return (
                      <Task data={task} />
                    )
                  })}
                </div>
              }
            </section>
          </main>
        </div>
      </>
    )
  }

  return <AccessDenied />


}

export default TaskPage

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
