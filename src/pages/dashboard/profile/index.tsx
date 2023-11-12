import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import Head from 'next/head'

import AccessDenied from "~/components/AccessDenied"
import Navbar from "~/components/Navbar"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"

// TODO: Display user info in a card
const ProfilePage = () => {
  const { data: sessionData } = useSession()
  const accounts = api.account.getAccounts.useQuery()

  console.log(accounts.data);

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
