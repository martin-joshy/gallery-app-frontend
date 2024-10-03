import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-slate-900 dark:text-slate-50"
              >
                Image Gallery
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full bg-white p-1 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-slate-50"
                >
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>
                    <Link to="/logout">Log out</Link>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-900 dark:text-slate-50 dark:hover:bg-slate-950 dark:focus:ring-slate-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Button
              variant="ghost"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-950 hover:text-slate-900 hover:bg-white dark:text-slate-50 dark:hover:text-slate-50 dark:hover:bg-slate-950"
            >
              <Link to="/logout">Log out</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
