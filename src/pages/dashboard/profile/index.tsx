import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Head from 'next/head'

import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import DetailParagraph from "~/components/profile/DetailParagraph"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"

// TODO: Display user info in a card
const ProfilePage = () => {
  const { data: sessionData } = useSession()
  const taskCount = api.task.getTasksCount.useQuery()
  const doneTaskCount = api.task.getTasksCountBasedOnStatus.useQuery({ done: true })
  const notDoneTaskCount = api.task.getTasksCountBasedOnStatus.useQuery({ done: false })

  if (sessionData !== null) {
    return (
      <>
        <Head>
          <title>TimeWise | Profile overview</title>
          <meta name="description" content="Get an overview of your timewise profile, and keep a watch on your info." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <Navbar username={sessionData.user.name!} imgUrl={sessionData.user.image!} />
          <section className="my-12 flex justify-center">
            <Card>
              <CardHeader>
                <CardTitle>Profile overview</CardTitle>
                <CardDescription>
                  Get an overview of your timewise profile, and keep a watch on your info.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-start justify-around">
                  <Avatar className="w-28 h-28">
                    <AvatarImage src={sessionData.user.image ?? undefined} alt="@UserImage" />
                    <AvatarFallback className="cursor-pointer">{sessionData.user.name ? sessionData.user.name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <DetailParagraph title='User name' detail={sessionData.user.name} fallbackText='Not available.' />
                    <DetailParagraph title="User email" detail={sessionData.user.email} fallbackText='Not available.' />
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-2xl">Account Details</h3>
                  <DetailParagraph title='Total number of tasks' detail={taskCount.isLoading ? 'Loading... ' : taskCount.data} fallbackText="You have no created tasks." />
                  <DetailParagraph title='Total number of finished tasks' detail={doneTaskCount.isLoading ? 'Loading... ' : doneTaskCount.data} fallbackText="You have no finished tasks." />
                  <DetailParagraph title='Total number of pending tasks' detail={notDoneTaskCount.isLoading ? 'Loading... ' : notDoneTaskCount.data} fallbackText="You have no pending tasks." />
                </div>
                <Separator className="my-5" />
              </CardContent>
            </Card>
          </section>
        </div>
      </>
    )
  }

  return <AccessDenied />

}

export default ProfilePage

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
