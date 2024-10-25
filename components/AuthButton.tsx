// app/components/AuthButtons.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const AuthButtons = () => {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <Button onClick={() => signIn("google")}>Googleでログイン</Button>
      ) : (
        <div className="flex justify-between items-center text-white">
          <p>こんにちは！ {session.user.name}</p>
          <Button onClick={() => signOut()}>ログアウト</Button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
