import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        console.log("[PATCH USER ID]", userId);

        const { courseId } = params;
        const values = await req.json();
        // ensure user is authenticated
        if ( !userId ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // patch course
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}