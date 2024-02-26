import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PATCH(  
    req: Request,
    { params }: { params: { courseId: string; chapterId: string}}
 ){
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        // check course owner
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        // find chapter to publish
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        // find muxData
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        });

        // check for missing required fields before publishing
        if (!chapter || !muxData || !chapter.title || !chapter.description ||  !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // if all required fields are available, publish it
        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[CHAPTER_PUBLISH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
 }