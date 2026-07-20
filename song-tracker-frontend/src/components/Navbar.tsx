import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, NavLink } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { LogoutButton } from "./LogoutButton";

interface NavItemProps {
  name: string;
  link: string;
}

function NavItem({ name, link }: NavItemProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex hover:text-gray-500 ${isActive ? "text-amber-600" : ""}`
      }
      to={link}
    >
      {name}
    </NavLink>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 flex w-auto flex-col items-start gap-x-4 border-b border-b-black p-4 font-bold md:flex-row md:items-center md:justify-between dark:bg-gray-900">
      <div className="flex w-full flex-row justify-between text-lg">
        <Link to="/">SongTracker</Link>
        <button
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="md:hidden"
          id="navbar-hamburger-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          {isMenuOpen ? <CgClose /> : <RxHamburgerMenu />}
        </button>
      </div>
      <div
        className={`${isMenuOpen ? "flex" : "hidden"} flex-col gap-12 pt-12 pb-4 text-sm md:flex md:flex-row md:gap-4 md:p-0`}
      >
        <NavItem link="/" name="HOME" />
        <NavItem link="/search" name="SEARCH" />
        {isLoggedIn ? (
          <LogoutButton logout={logout} />
        ) : (
          <NavItem link="/login" name="LOG IN" />
        )}
      </div>
    </div>
  );
}
