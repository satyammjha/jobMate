import { useSignIn } from "@clerk/clerk-react";

function AuthButtons() {
  const { signIn } = useSignIn();

  const handleSignIn = async () => {
    await signIn.authenticateWithRedirect({ redirectUrl: "/dashboard" });
  };

  return (
    <button onClick={handleSignIn} className="clerk-button">
      Sign In
    </button>
  );
}

export default AuthButtons;