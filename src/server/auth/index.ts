import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth };
