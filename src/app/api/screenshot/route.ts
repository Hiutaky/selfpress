import { NextRequest, NextResponse } from "next/server";
import { takeScreenshot } from "~/utils/screenshot";

export async function POST(req: NextRequest) {
  const { url, id } = await req.json();
  if (!url || !id) {
    return NextResponse.json("Provide valid url and id", { status: 400 });
  }

  try {
    const path = await takeScreenshot(url, id);
    return NextResponse.json(path, {
      status: 200,
    });
  } catch (error) {
    console.error("Error taking screenshot:", error);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}
