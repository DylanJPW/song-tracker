import { useState } from "react";
import { LoginForm } from "@/components/forms/LoginForm";
import { SignUpForm } from "@/components/forms/SignUpForm";

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  return (
    <div className="flex w-full grow justify-center self-center bg-slate-900 md:w-lg">
      {isSignUp ? (
        <SignUpForm setIsSignUp={setIsSignUp} />
      ) : (
        <LoginForm setIsSignUp={setIsSignUp} />
      )}
    </div>
  );
}