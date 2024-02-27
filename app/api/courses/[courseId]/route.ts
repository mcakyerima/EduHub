import Mux from "@mux/mux-node"; // for deleting mux data when deletig course
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// connect to mux api
const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Course Delete route.
export async function DELETE(
    req: Request,
    {params}: {params: { courseId: string }},
){
    try {
        // veryfiy if user is allowed to modify data
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        } 

        // find the course related to the id and include its mux data
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        // Loop through course chapters and delete muxData
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                console.log("[CHAPTER_MUX_DATA]", chapter.muxData.assetId);
                try {
                    await video.assets.delete(chapter.muxData.assetId);
                    console.log(`Asset with ID ${chapter.muxData.assetId} deleted successfully.`);
                } catch (error) {
                    console.error(`Error deleting asset with ID ${chapter.muxData.assetId}:`, error);
                    // You can choose to handle the error here, or simply log it and continue
                }
            }
        }

        // now delete course
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            }
        });

        return NextResponse.json(deletedCourse);


    } catch(error) {
        console.log("[COURSE_DELETE_ERROR]", error);
        return new NextResponse("Internal Error Delete", { status: 500 });
    }
};

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