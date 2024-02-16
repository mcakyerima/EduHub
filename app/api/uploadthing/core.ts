import { auth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();


const handleAuth = () => {
    const { userId } = auth();
    console.log("[userId from upload]", userId);
    if(!userId) throw new Error("Unauthorized");
    return { userId };
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({image: { maxFileSize: "4MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    courseAttatchement: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB"}})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;