import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export  async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        //  handle empty userId
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 301});
        }

        // creating course
        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[Courses]", error);
        return new NextResponse("Internal Error", {status : 500})
    }
}