import { auth } from "clerk/next";
import { NextResponse } from "next/server";


export async function PUT(
    req: Request,
    { params }: { params: { courseId: string }}
){
    try{

        const { userId } = auth()
    } catch (error) {
        console.log("[ERROR]", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}