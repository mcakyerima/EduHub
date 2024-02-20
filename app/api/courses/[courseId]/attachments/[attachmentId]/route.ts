import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: {params: { courseId: string, attachmentId: string}}
) {
    try {
        const { userId } = auth();
        
        // if no userId, return unathorized
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // verify user deleting file is the owner of file
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        // if not owner, return anauthorized response
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // delete attachment after validation
        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            }
        });

        // return the deleted attachment
        return NextResponse.json(attachment);
        
    } catch (error) {
        console.log("ATTACHMENT_ID", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}