import Link from 'next/link'
import { useRouter } from "next/router"
import { BiSolidError } from 'react-icons/bi'

// if an error occures during authentication we redirect the user to this page and display
// the error
const ErrorPage = () => {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
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
