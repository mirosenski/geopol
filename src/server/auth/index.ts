import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const nextAuthResult = NextAuth(authConfig);

const auth = cache(nextAuthResult.auth);

export { auth };
