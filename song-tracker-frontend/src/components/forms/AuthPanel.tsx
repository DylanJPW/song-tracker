import {useState} from "react";
import {LoginForm} from "@/components/forms/LoginForm/LoginForm";
import {SignUpForm} from "@/components/forms/SignUpForm/SignUpForm";

export function AuthPanel() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return isSignUp ? (
    <SignUpForm setIsSignUp={setIsSignUp}/>
  ) : (
    <LoginForm setIsSignUp={setIsSignUp}/>
  );
}