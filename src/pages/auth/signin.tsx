import type { GetServerSideProps, NextPage } from "next"
import type { ClientSafeProvider } from "next-auth/react"
import { getProviders, signIn } from "next-auth/react"
import Head from "next/head"

import { getIcon } from "~/utils/helpers"

interface Props {
  providers: ClientSafeProvider[]
}

// this the signin page that allow the user to connect using a provider of his choice
// for example: discord, github; google, etc...
const SignInPage: NextPage<Props> = ({ providers }) => {
  return (
    <>
      <Head>
        <title>TimeWise | SignIn</title>
        <meta name="description" content="Sign In/Login to Manage your time easily, efficiently and wisely" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full flex flex-col items-center justify-center space-y-7">
        <h1 className="font-bold text-2xl">Let&apos;s dive in</h1>
        {/* we loop over the provider array and display each provider with its appropriate name and icon*/}
        {Object.values(providers).map((provider) => {
          // get icon based on the provider type eg: id = discord => discord icon
          let Icon = getIcon(provider.id)
          return (
            <button
              className="rounded-xl bg-zinc-700/50 px-3 py-5 hover:bg-zinc-600/50 flex items-center space-x-3"
              onClick={() => signIn(provider.id, { callbackUrl: '/dashboard/task' })}
            >
              <Icon /> <span>Login with {provider.name}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export default SignInPage

// fetch the provider array defined in the authoptions pre-render
export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: {
      providers
    }
  }
}
