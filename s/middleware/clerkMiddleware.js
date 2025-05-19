// clerkMiddleware.js
import { requireAuth } from "@clerk/express";

const clerkMiddleware = requireAuth({
  redirectTo: false, // Disable redirects
  onError: (error) => {
    // Custom error handler to return JSON
    throw new Error("Unauthorized: Invalid or missing JWT");
  },
});

export default clerkMiddleware;