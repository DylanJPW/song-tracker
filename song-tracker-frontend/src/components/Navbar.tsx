import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";

interface NavItemProps {
  name: string;
  link: string;
}

function NavItem({ name, link }: NavItemProps) {
  const { pathname } = window.location;
  const isActive = pathname === link;

  return (
    <div
      className={`flex hover:text-gray-500 ${isActive ? "text-amber-600" : ""}`}
    >
      <a href={link}>{name}</a>
    </div>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="sticky top-0 z-10 flex w-auto flex-col items-start gap-x-4 border-b border-b-black p-4 font-bold md:flex-row md:items-center md:justify-between dark:bg-gray-900">
      <div className="flex w-full flex-row justify-between text-lg">
        <a href="/">SongTracker</a>
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
      </div>
    </div>
  );
}
