import { CgDanger } from "react-icons/cg"
import AuthButton from "./AuthButton"

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-7">
      <CgDanger size={70} className="text-red-600/75" />
      <h3 className="font-bold text-2xl">Access denied</h3>
      <AuthButton />
    </div>
  )
}

export default AccessDenied
