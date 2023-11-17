import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

import Navbar from "~/components/Navbar"
import { authOptions } from "~/server/auth"
import AccessDenied from "~/components/AccessDenied"
import { Button } from '~/components/ui/button'
import Groups from '~/components/group/Groups'

const GroupIndexPage = () => {
  // get the session data from the server
  const { data: sessionData } = useSession()

  if (sessionData !== null) {
    return (
      <>
        <Head>
          <title>TimeWise | Groups Lists</title>
          <meta name="description" content="View groups and access them to see list of their tasks." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <div className="my-10">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">View your Groups</h3>
              <Link href='/dashboard/group/add'>
                <Button variant='outline'>
                  Create <Plus className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <Groups />
          </div>
        </main>
      </>
    )
  }
  return <AccessDenied />
}

export default GroupIndexPage

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
