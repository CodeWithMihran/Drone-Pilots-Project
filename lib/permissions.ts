import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { UserRole } from "@/models/User";
import { NextResponse } from "next/server";
import { connectToDatabase } from "./mongodb";
import { Certification } from "@/models/Certification";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

export async function getAuthSession(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return session.user as unknown as AuthenticatedUser;
}

export async function requireAuthUser(): Promise<
  { user: AuthenticatedUser; errorResponse?: never } | { user?: never; errorResponse: NextResponse }
> {
  const user = await getAuthSession();
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      ),
    };
  }

  if (user.status === "SUSPENDED") {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden. Your account is suspended." },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export async function requireRole(
  allowedRoles: UserRole[]
): Promise<
  { user: AuthenticatedUser; errorResponse?: never } | { user?: never; errorResponse: NextResponse }
> {
  const auth = await requireAuthUser();
  if (auth.errorResponse) return auth;

  if (!allowedRoles.includes(auth.user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: `Forbidden. Requires one of [${allowedRoles.join(", ")}] role.` },
        { status: 403 }
      ),
    };
  }

  return { user: auth.user };
}

export async function checkPilotVerified(userId: string): Promise<boolean> {
  await connectToDatabase();
  const cert = await Certification.findOne({
    pilotId: userId,
    status: "VERIFIED",
    expiryDate: { $gt: new Date() },
  });
  return Boolean(cert);
}
