// app/components/AuthButtons.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Session } from "next-auth";

const AuthButtons = ({ session }: { session: Session | null }) => {
  return (
    <div>
      {!session ? (
        <Button onClick={() => signIn("google")}>Googleでログイン</Button>
      ) : (
        <div className="flex justify-between items-center">
          <p>こんにちは！ {session.user.name}</p>
          <Button onClick={() => signOut()}>ログアウト</Button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
