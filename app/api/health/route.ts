
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'; // Forces static generation
export const revalidate = false; // Optional: Ensures no revalidation

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
