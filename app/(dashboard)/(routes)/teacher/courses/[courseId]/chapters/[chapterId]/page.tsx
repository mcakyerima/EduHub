import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {

    // protect our component from users that are not logged in
    const { userId } = auth();

    if ( !userId ) {
        return redirect("/");
    }

    return (
        <div>
            chapter
        </div>
    );
}

export default ChapterIdPage;