import { Asset } from './../../../../../../node_modules/@mux/mux-node/resources/video/assets.d';
import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// fetch must keys
const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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