import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    {params}: {params: { courseId:string; chapterId: string}},
){
    try {

        // get userId and check if user editing is logged in user
        const { userId } = auth();
        // Extract values from request, destructure isPublished to stop users
        // from accidentally publishing course during update.
        const {isPublished, ...values} = await req.json();

        // If not logged in user, return error
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // check userId in db to ensure editor is course owner
        const ownCourse  = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // update chapters from database#
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }, 
            data: {
                ...values,
            }
        });

        // TODO: handle video upload.

        // return updated course
        return NextResponse.json(chapter, { status: 200});

    } catch (error) {
        console.log("[COURSES_CHAPTER_ID", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}