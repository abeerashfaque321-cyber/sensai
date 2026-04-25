import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// In routes par login zaroori hai
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Agar request Inngest API ki hai, toh use check mat karo (Public rakho)
  if (req.nextUrl.pathname.startsWith("/api/inngest")) {
    return NextResponse.next();
  }

  // 2. Agar user logged in nahi hai aur protected route access kar raha hai
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Next.js internals aur static files ko ignore karne ke liye
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Hamesha API routes par middleware run karein
    '/(api|trpc)(.*)',
  ],
};