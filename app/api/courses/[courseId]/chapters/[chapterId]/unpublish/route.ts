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


        // unPublish chapter.
        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false
            }
        });
        
        // After uplublishing this chapter, we have to check if it is 
        // the only Published chapter in the coure, if we upublish this
        // chapter, we also have to upublish the entire course.

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        // if no chapters published? then unpublish course as well.
        if (!publishedChaptersInCourse) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishChapter);

    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
 }