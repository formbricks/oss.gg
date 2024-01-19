import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"
import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "avatarUrl" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.avatarUrl ? (
        <AvatarImage alt="Picture" src={user.avatarUrl} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <UserIcon className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
