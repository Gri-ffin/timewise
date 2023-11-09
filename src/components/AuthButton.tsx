import { signOut, signIn, useSession } from "next-auth/react";

// this is the signin button used in the index page (welcome page) that redirect to a custom page to login using
// a provider
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

export default AuthButton
