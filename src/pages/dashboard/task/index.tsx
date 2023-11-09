import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Link from 'next/link'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon, TextIcon } from "lucide-react"

import DateNavigationMenu from "~/components/task/DateNavigationMenu"
import { authOptions } from "~/server/auth"
import { Button } from "~/components/ui/button"
import Head from "next/head"
import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import { api } from "~/utils/api"
import Task from "~/components/task/Task"
import type { Period } from "~/utils/task/types"

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
dayjs.extend(weekOfYear)

const TaskPage = () => {
  const { data: sessionData } = useSession()
  const [date, setDate] = useState(dayjs())
  const [period, setPeriod] = useState<Period>('day')

  const startDateFilter = date.startOf(period).toDate();
  const finishDateFilter = date.endOf(period).toDate();

  const tasks = api.task.getTasks.useQuery({ startDateFilter: startDateFilter, finishDateFilter: finishDateFilter });

  const switchDate = (state: 'substract' | 'add') => {
    switch (state) {
      case 'substract':
        setDate(prev => prev.subtract(1, period))

        break;

      case 'add':
        setDate(prev => prev.add(1, period))
        break
    }
  }
  const changePeriod = (period: Period) => {
    setPeriod(period)
  }

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
              <DateNavigationMenu changePeriod={changePeriod} period={period} />
            </div>
            <section className="my-14">
              <div className="flex flex-row items-center justify-center space-x-7">
                <ArrowLeftIcon onClick={() => switchDate('substract')} className="cursor-pointer" />
                <h3 className="text-3xl text-center">
                  {
                    period === 'day' ? days[date.day()] :
                      period === 'week' ? `Week ${date.week()} of ${date.year()}` :
                        period === 'month' ? `${date.format('MMMM')} of ${date.year()}` :
                          `Year ${date.year()}`

                  }
                </h3>
                <ArrowRightIcon onClick={() => switchDate('add')} className="cursor-pointer" />
              </div>
              <p className="text-slate-500 text-center my-4">
                {
                  period === 'day' ? date.format('MMM DD, YYYY') :
                    `${dayjs(startDateFilter).format('MMM DD')} - ${dayjs(finishDateFilter).format('MMM DD')}`
                }
              </p>
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
                  {tasks.data!.length > 0 ? tasks.data?.map(task => {
                    return (
                      <Task data={task} key={task.id} />
                    )
                  }) : <div className="mt-10 font-semibold text-center text-xl">You don't have any tasks.</div>}
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
