import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {createUser} from "@/api/authentication";
import {type SignUpFormData, signUpSchema} from "./SignUpSchema";
import type {LoginSignUpProps} from "../types";
import {toast} from "react-toastify";
import {useAuth} from "@/context/AuthContext";
import {useNavigate} from "react-router";
import {FormItem} from "@/components/forms/shared/FormItem";

export function SignUpForm({setIsSignUp}: LoginSignUpProps) {
  const {
    setError,
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {login} = useAuth();
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data, {username}) => {
      login(data.token);
      navigate("/");
      toast(`Successfully logged in as ${username}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
    onError: ({message}) => {
      setError("username", {
        type: "server",
        message,
      });
    }
  });

  function onSubmit({username, password}: SignUpFormData) {
    createUserMutation.mutate({username, password});
  }

  return (
    <form
      className='flex flex-col justify-center w-full px-10 sm:px-40 md:px-20'
      id='sign-up-form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormItem
        id="username"
        title="Username"
        register={register}
        error={errors.username}
        placeholder="Enter username"
      />
      <FormItem
        id="password"
        title="Password"
        register={register}
        error={errors.password}
        placeholder="Enter password"
        type="password"
      />
      <FormItem
        id="confirmPassword"
        title="Confirm Password"
        register={register}
        error={errors.confirmPassword}
        placeholder="Confirm password"
        type="password"
      />
      <button
        className='my-2 w-fit cursor-pointer self-end rounded-sm bg-blue-500 p-2 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        disabled={!isValid}
        type='submit'
      >
        Sign Up
      </button>
      <div className="text-center">
        <button
          className="cursor-pointer underline hover:text-blue-500"
          onClick={() => setIsSignUp(false)}
          type="button"
        >
          Log in with existing account
        </button>
      </div>
    </form>
  );
}