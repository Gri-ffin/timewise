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
import type { Period } from "~/utils/task/types"
import Tasks from "~/components/task/Tasks"

// dayjs returns a number when calling the day function so we will just
// choose the day based on the number
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// this is used to get a function called weekOfYear which return the number of the current week
// during the whole year
dayjs.extend(weekOfYear)

const TaskPage = () => {
  const { data: sessionData } = useSession()
  // we will use this to update start and finish date from today based on the period to
  // fetch the tasks and display the correct date based on the period selected
  const [date, setDate] = useState(dayjs())
  // this will update the period chosen by the user
  const [period, setPeriod] = useState<Period>('day')

  // this is the start of the date to fetch
  const startDateFilter = date.startOf(period).toDate();
  // we will fetch the tasks between the start and this finish date based
  // on period for example if period is week we fetch the tasks of the current week
  const finishDateFilter = date.endOf(period).toDate();

  // this is used so the user can switch between days and week and months and years
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
  // the period changes based on the user selection 
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
        <div>
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <main>
            <div className="flex items-center justify-center my-5">
              {/* the user can choose the available periods from this component and update the state of this page*/}
              <DateNavigationMenu changePeriod={changePeriod} period={period} />
            </div>
            <section className="my-14">
              <div className="flex flex-row items-center justify-center space-x-7">
                {/* this switch to the previous day, week, month or year*/}
                <ArrowLeftIcon onClick={() => switchDate('substract')} className="cursor-pointer" />
                <h3 className="text-2xl text-center">
                  {
                    // this displays the day name for example Sunday, Monday ...
                    period === 'day' ? days[date.day()] :
                      // this displays for example Week 45 of 2024 based on the number of the current week in the year 
                      period === 'week' ? `Week ${date.week()} of ${date.year()}` :
                        // this displays for example January of 2024
                        period === 'month' ? `${date.format('MMMM')} of ${date.year()}` :
                          // this displays the current year
                          `Year ${date.year()}`

                  }
                </h3>
                <ArrowRightIcon onClick={() => switchDate('add')} className="cursor-pointer" />
              </div>
              <p className="text-slate-500 text-center my-4">
                {
                  // this shows for example the full date of today eg: oct 27, 2024
                  period === 'day' ? date.format('MMM DD, YYYY') :
                    // this will show the month and day of the interval of period
                    // eg: period is year 2024 it will display Jan 1 - Dec 31
                    `${dayjs(startDateFilter).format('MMM DD')} - ${dayjs(finishDateFilter).format('MMM DD')}`
                }
              </p>
              <Link href='/dashboard/task/add'>
                <Button className="w-full justify-start" variant='outline'>
                  <TextIcon className="mr-2 h-4 w-4" /> Add a task...
                </Button>
              </Link>
              <Tasks startDateFilter={startDateFilter} finishDateFilter={finishDateFilter} />
            </section>
          </main>
        </div>
      </>
    )
  }

  return <AccessDenied />


}

export default TaskPage

// prefetch the session to check if user is authenticated or not
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
