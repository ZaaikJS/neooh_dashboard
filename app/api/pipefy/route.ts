// App Router (Next.js 13+)
// src/app/api/pipefy/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const response = await fetch("https://api.pipefy.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PIPEFY_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}