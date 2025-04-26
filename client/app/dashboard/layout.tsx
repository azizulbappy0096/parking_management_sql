"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Car,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  ParkingCircle,
  ParkingSquare,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Parking Spaces",
      href: "/dashboard/parking-spaces",
      icon: ParkingSquare,
      submenu: [
        { name: "All Spaces", href: "/dashboard/parking-spaces" },
        { name: "Add Space", href: "/dashboard/parking-spaces/new" },
      ],
    },
    {
      name: "Parking Spots",
      href: "/dashboard/parking-spots",
      icon: ParkingCircle,
      submenu: [
        { name: "All Spots", href: "/dashboard/parking-spots" },
        { name: "Add Spot", href: "/dashboard/parking-spots/new" },
      ],
    },
    { name: "Vehicles", href: "/dashboard/vehicles", icon: Car },
    { name: "Generate Slip", href: "/dashboard/slips/new", icon: ClipboardList },
  ]

  const NavItem = ({ item, mobile = false }) => {
    const [submenuOpen, setSubmenuOpen] = useState(false)
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

    return (
      <div className="w-full">
        <div className="flex w-full items-center">
          <Link
            href={item.href}
            className={cn(
              "flex h-10 w-full items-center rounded-md px-3 text-sm font-medium",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
            onClick={() => mobile && setIsOpen(false)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
          {item.submenu && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8"
              onClick={() => setSubmenuOpen(!submenuOpen)}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", submenuOpen && "rotate-180")} />
            </Button>
          )}
        </div>

        {item.submenu && submenuOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.submenu.map((subitem) => (
              <Link
                key={subitem.href}
                href={subitem.href}
                className={cn(
                  "flex h-8 items-center rounded-md px-3 text-sm font-medium",
                  pathname === subitem.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={() => mobile && setIsOpen(false)}
              >
                {subitem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex h-16 items-center border-b px-4">
                    <h2 className="text-lg font-semibold">ParkEase</h2>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="space-y-1 p-2">
                    {navigation.map((item) => (
                      <NavItem key={item.name} item={item} mobile />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl font-bold">ParkEase</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {!isMobile && (
          <aside className="w-64 border-r">
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
