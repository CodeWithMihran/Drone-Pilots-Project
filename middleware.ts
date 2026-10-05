import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // Role-based route guard
    if (path.startsWith("/pilot") && role !== "PILOT") {
      if (role === "COMPANY") return NextResponse.redirect(new URL("/company/dashboard", req.url));
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/company") && role !== "COMPANY") {
      if (role === "PILOT") return NextResponse.redirect(new URL("/pilot/dashboard", req.url));
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/admin") && role !== "ADMIN") {
      if (role === "PILOT") return NextResponse.redirect(new URL("/pilot/dashboard", req.url));
      if (role === "COMPANY") return NextResponse.redirect(new URL("/company/dashboard", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const isProtected =
          path.startsWith("/pilot") ||
          path.startsWith("/company") ||
          path.startsWith("/admin");
        if (!isProtected) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/pilot/:path*", "/company/:path*", "/admin/:path*"],
};
