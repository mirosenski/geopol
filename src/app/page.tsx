import { redirect } from "next/navigation";
import Link from "next/link";
import Map from "./_components/Map";

export default function HomePage() {
  redirect("/auth");
}
