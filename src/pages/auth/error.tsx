import Link from 'next/link'
import { useRouter } from "next/router"
import { BiSolidError } from 'react-icons/bi'

const ErrorPage = () => {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-5">
      <BiSolidError size={100} className="text-red-700" />
      <p className="text-center text-slate-500">
        Oops, it seems there is a problem with the {error}.
      </p>
      <Link href='/dashboard/task' className='px-5 py-3 bg-blue-700/90 hover:bg-blue-700/70'>
        Go back to safety
      </Link>
    </div>
  )
}

export default ErrorPage
