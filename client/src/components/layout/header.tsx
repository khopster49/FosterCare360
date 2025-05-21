import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();

  // Fetch user data using our auth hook
  const { user, isLoading, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", "POST");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-xl font-bold text-orange-600">UK Fostering</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <span className={`text-sm font-medium cursor-pointer ${
                currentLocation === "/" ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}>Home</span>
            </Link>
            <Link href="/apply">
              <span className={`text-sm font-medium cursor-pointer ${
                currentLocation === "/apply" ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}>Apply</span>
            </Link>
            <Link href="/faq">
              <span className={`text-sm font-medium cursor-pointer ${
                currentLocation === "/faq" ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}>FAQ</span>
            </Link>
            <Link href="/contact">
              <span className={`text-sm font-medium cursor-pointer ${
                currentLocation === "/contact" ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}>Contact</span>
            </Link>
          </nav>

          {/* User Menu or Login/Register */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-orange-100 text-orange-800">
                        {user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <div className="w-full cursor-pointer">Dashboard</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <div className="w-full cursor-pointer">Profile Settings</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 mt-3 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">Home</span>
              </Link>
              <Link href="/apply">
                <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">Apply</span>
              </Link>
              <Link href="/faq">
                <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">FAQ</span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">Contact</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">Dashboard</span>
                  </Link>
                  <Link href="/profile">
                    <span className="text-gray-600 hover:text-gray-900 py-1 block cursor-pointer">Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 hover:text-red-700 py-1"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}