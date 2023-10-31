import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {

  return (
    <>
      <Head>
        <title>TimeWise</title>
        <meta name="description" content="Manage your time easily, efficiently and wisely" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen w-full">
        <nav className="flex items-center justify-between">
          <h1 className="font-extrabold text-lg">TimeWise</h1>
          <AuthButton />
        </nav>

        <section className="my-16 flex flex-col items-center justify-center space-y-5">
          <h3 className="font-bold text-3xl text-center">The easiest way to manage your time </h3>
          <p className="text-center">
            Organize, manage, and optimize your time. Track every moment, from
            productive tasks to leisure, and unlock your full potential.
          </p>
          <AuthButton />
        </section>

        <section className="flex flex-col justify-center items-center">
          <h3 className="font-bold text-2xl my-10">But a glimpse on some features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-start md:place-items-center gap-5 md:w-10/12 lg:w-7/12">
            <div className="space-y-5">
              <h6 className="font-semibold text-lg">Time tracking and Categorization</h6>
              <p className="text-gray-400">
                manually track their activities and categorize them into different areas, such
                as work, studying, leisure, socializing, exercise, and more.
              </p>
            </div>
            <div className="space-y-5">
              <h6 className="font-semibold text-lg">Time Tracking</h6>
              <p className="text-gray-400">
                Track time spent on tasks and projects, see time allocated efficiently and wasted
                time.
              </p>
            </div>
            <div className="space-y-5">
              <h6 className="font-semibold text-lg">Analytics and insights</h6>
              <p className="text-gray-400">
                Get statistics and insights into time management and productivity.
              </p>
            </div>
            <div className="space-y-5">
              <h6 className="font-semibold text-lg">Reminders and Notifications</h6>
              <p className="text-gray-400">
                Setup email, push notifications, and/or SMS reminders for upcoming tasks and events.
              </p>
            </div>
          </div>
        </section>

        <footer className="my-9 text-center">
          Made with ❤️  from Morocco.
        </footer>

      </main>
    </>
  );
}

function AuthButton() {
  const { data: sessionData } = useSession();

  return (
    <button
      className="rounded-xl full bg-blue-700/70 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
}
