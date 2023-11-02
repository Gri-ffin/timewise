import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Link from 'next/link'

import dayjs from 'dayjs'
import { CgDanger } from 'react-icons/cg'

import AuthButton from "~/components/AuthButton"
import ProfileDropDown from "~/components/ProfileDropDown"
import DateNavigationMenu from "~/components/task/DateNavigationMenu"
import { authOptions } from "~/server/auth"
import { Button } from "~/components/ui/button"
import { TextIcon } from "lucide-react"

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TaskPage = () => {
  const { data: sessionData } = useSession()

  let now = dayjs()
  const currentDay = days[now.day()]
  const currentDate = now.format('MMM DD, YYYY')

  if (sessionData !== null) {
    return (
      <div className="min-h-screen">
        <nav className="flex items-center justify-between">
          <h1 className="font-extrabold text-lg">TimeWise</h1>
          <ProfileDropDown username={sessionData.user.name!} />
        </nav>
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
            {/* TODO: Change this to the todos list once i start working on the db */}
            <div className="flex flex-col items-center justify-center mt-44">
              <p className="text-xl">Well, no tasks seems to be found.</p>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-7">
      <CgDanger size={70} className="text-red-600/75" />
      <h3 className="font-bold text-2xl">Access denied</h3>
      <AuthButton />
    </div>
  )

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
