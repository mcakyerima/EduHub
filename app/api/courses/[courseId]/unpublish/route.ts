import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    {params}: { params: { courseId: string}}
){
    try {
        // fetch user and verify
        const { userId } = auth();

        if (!userId) {
             return new NextResponse("Unauthorized", { status: 401});
        }

        //  fetch course we are publishing
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!course) { 
            return new NextResponse("Not found", { status: 404 });
        }


        // publish course if all required fields are available
        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unpublishedCourse);
        
    } catch (error) {
        console.log("[COURSE_UNPUBLISH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}