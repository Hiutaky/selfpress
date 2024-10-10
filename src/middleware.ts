import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // your middleware stuff here
  const { pathname } = request.nextUrl
  const response = NextResponse.next();
  response.headers.set('x-url', request.url);
  response.headers.set('pathname', pathname);
  return response;
}