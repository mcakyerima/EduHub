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
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) { 
            return new NextResponse("Not found", { status: 404 });
        }

        // verify course has published chapter before publishing.
        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
        // check if required fields are complete
        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required fields", { status: 401});
        }

        // publish course if all required fields are available
        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);
        
    } catch (error) {
        console.log("[COURSE_PUBLISH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}