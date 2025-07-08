// app/ui/NavBar.tsx
'use client';

import Link from "next/link";
import { PlusCircledIcon, ArchiveIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, type IconProps } from "@radix-ui/themes";
import { signout } from "../../actions/auth";
import { type ComponentType } from "react";

type NavLink = {
  name: string;
  icon: ComponentType<IconProps>;
  href: string;
};

const links: NavLink[] = [
  { name: "Create", icon: PlusCircledIcon, href: "/dashboard/create" },
  { name: "Library", icon: ArchiveIcon, href: "/dashboard/library" },
];

export default function NavBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-4 overflow-y-auto bg-gradient-to-bl from-violet-500 to-indigo-500 text-white border-r border-black dark:border-white ${className}`}
    >
      {/* Logo */}
      <div className="flex flex-row justify-start p-4 pt-8">
        <Link className="relative inline-block w-full h-auto p-2 max-w-[7rem] font-extrabold" href="/">
          TuneSpy
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col px-4 gap-1">
        {links.map(({ name, icon: Icon, href }) => (
          <Link key={name} href={href}>
            <div className="flex items-center gap-3 rounded-md p-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
              <Icon className="h-5 w-5" />
              {name}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex-1"></div>

      {/* Sign Out */}
      <div className="flex flex-col px-4 gap-2">
        <Button className="!cursor-pointer" onClick={() => signout()} radius="full" size="4" variant="surface" highContrast>
          Sign Out
        </Button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300">
        <div className="flex flex-row justify-center items-center gap-2 p-2 py-4">
          <a
            href="https://github.com/karl-andres"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
          >
            <GitHubLogoIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
