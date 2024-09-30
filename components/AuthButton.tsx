// app/components/AuthButtons.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const AuthButtons = () => {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <Button onClick={() => signIn("google")}>Sign In with Google</Button>
      ) : (
        <>
          <p>こんにちは！ {session.user.name}</p>
          <br />
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      )}
    </>
  );
};

export default AuthButtons;
