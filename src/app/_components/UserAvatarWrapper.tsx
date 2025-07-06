"use client";
import { UserAvatar } from "./UserAvatar";

// Typen für UserAvatarWrapper-Props
interface UserAvatarWrapperProps {
  name: string;
  image?: string;
}

export default function UserAvatarWrapper(props: UserAvatarWrapperProps) {
  return <UserAvatar {...props} />;
}
