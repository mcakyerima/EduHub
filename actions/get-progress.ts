import { db } from "@/lib/db";

export const getProgress = async ( 
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        // fetch published chapers from db
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        });

        // create an array of all published chapters id's
        const publishedChaptIds = publishedChapters.map((chapter) => chapter.id);

        // check all chapters user has complented in userProgress table
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChaptIds,
                },
                isCompleted: true,
            }
        });

        const progressPercentage = (validCompletedChapters / publishedChaptIds.length) * 100;
        return progressPercentage;
        
    } catch (err) {
        console.log("[GET_PROGRESS_ERROR]", err);
        return 0;
    }
}