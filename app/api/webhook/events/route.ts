import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("techstax_db");

    const events = await db
      .collection("events")
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    // Convert _id to string for Next.js
    const safeEvents = events.map((e) => ({
      ...e,
      _id: e._id.toString(),
    }));

    return NextResponse.json(safeEvents);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
