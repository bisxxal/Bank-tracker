import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const getCachedSession = cache(() => getServerSession(authOptions));
