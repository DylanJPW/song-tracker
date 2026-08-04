import {useAuth} from "@/context/AuthContext";
import {Navigate, Outlet} from "react-router";

export function ProtectedRoute() {
  const {isLoggedIn} = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace={true}/>;
  }

  return <Outlet/>;
}