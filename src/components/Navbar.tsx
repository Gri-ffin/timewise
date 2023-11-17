import ProfileDropDown from "./ProfileDropDown"

// this is the navbar that display the app title and the user image and menu
const Navbar = ({ username, imgUrl }: { username: string, imgUrl: string }) => {
  return (
    <nav className="flex items-center justify-between font-extrabold">
      <h1 className="text-xl">TimeWise</h1>
      <ProfileDropDown username={username} imgUrl={imgUrl} />
    </nav>
  )
}

export default Navbar
