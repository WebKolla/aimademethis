"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, Search, User as UserIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Fetch username from profiles
        supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setUsername((data as { username: string }).username);
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUsername((data as { username: string }).username);
          });
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
              AIMMT
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/trending"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10  dark:text-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    AIMMT
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {/* Search in Mobile Menu */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10"
                    />
                  </div>
                </form>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/products"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2"
                  >
                    Explore
                  </Link>
                  <Link
                    href="/trending"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2"
                  >
                    Trending
                  </Link>
                  <Link
                    href="/categories"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2"
                  >
                    About
                  </Link>
                </nav>

                {/* User Actions */}
                <div className="border-t pt-6 mt-4 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Button variant="outline" className="justify-start" asChild onClick={closeMobileMenu}>
                        <Link href="/dashboard">
                          <UserIcon className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button className="justify-start" asChild onClick={closeMobileMenu}>
                        <Link href="/products/new">Submit Product</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild onClick={closeMobileMenu}>
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button asChild onClick={closeMobileMenu}>
                        <Link href="/signup">Sign up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Actions */}
          {user ? (
            <>
              <NotificationBell />
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/dashboard">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {username || "Profile"}
                </Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link href="/products/new">Submit Product</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
