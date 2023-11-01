import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { authOptions } from "~/server/auth"

import { CgDanger } from 'react-icons/cg'

import AuthButton from "~/components/AuthButton"
import ProfileDropDown from "~/components/ProfileDropDown"
import DateNavigationMenu from "~/components/task/DateNavigationMenu"

const TaskPage = () => {
  const { data: sessionData } = useSession()

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
          <section>

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
