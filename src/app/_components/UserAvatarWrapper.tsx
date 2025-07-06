"use client";
import { UserAvatar } from "./UserAvatar";

export default function UserAvatarWrapper(props: { name: string; image?: string }) {
  return <UserAvatar {...props} />;
}
