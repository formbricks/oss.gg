"use client"

import { User } from "next-auth"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

interface UserAccountNavProps {
  user: {
    name: User["name"]
    avatarUrl: User["image"]
    email?: User["email"]
  }
}

const topNavigation = [
  { label: "Open issues", url: "/issues" },
  { label: "Enroll to play", url: "/enroll" },
  { label: "Settings", url: "/settings" },
  { label: "Your profile", url: "/", target: "_blank" },
]

const bottomNavigation = [
  { label: "What is oss.gg?", url: "https://oss.gg", target: "_blank" },
  { label: "Help build oss.gg", url: "/contribute" },
]

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, avatarUrl: user.avatarUrl || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
