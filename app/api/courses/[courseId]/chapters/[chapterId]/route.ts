import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// fetch must keys
const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Delete chapter in chapters
export async function  DELETE(
    req: Request,
    {params}: {params: { courseId:string; chapterId: string}},
){
    try{
        // get user id making delete
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized User", { status: 401});
        }

        // check if it's course owner making delete
        const ownCourse = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse){
            return new NextResponse("Unauthorized Author", { status: 401});
        }

        // find chapter corresping to payload.
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        // if no chapter to delete, return 404
        if (!chapter) {
            return new NextResponse("Chapter Not Found", { status: 404 });
        }

        // check if chapter has a videoUrl then delete it's muxData
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            // if the muxData exist, delete it using its assetId
            if (existingMuxData) {
                // delete muxData from muxdata endpoint
                await video.assets.delete(existingMuxData.assetId);
                //delete muxData from db
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        // delete the chapter from db after successfull deletion of video assets
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            }
        });

        // Clean up operation to check if the chapter deleted is published, if true
        // then unpublish the entire course;
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        // if no other chapter is published, unpublish course
        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);

    }catch (error){
        console.log("[CHAPTER_ID_DELETE]", error);
    }

}
// Patch data into chapters
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

        

        // handle video upload.
        if(values.videoUrl) {
            // check if their is an existing video for the chapter.
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            // if it exist, delete video before adding new one.
            if (existingMuxData) {
                // delete video before adding new one
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id:existingMuxData.id,
                    }
                });
            }

            // create Mux video asset
            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ['public'],
                test: false
            });

            // Add to db
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        // return updated course
        return NextResponse.json(chapter, { status: 200});

    } catch (error) {
        console.log("[COURSES_CHAPTER_ID", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}