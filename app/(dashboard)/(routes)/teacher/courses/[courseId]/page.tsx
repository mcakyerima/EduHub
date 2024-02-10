import db from "@/lib/db";
import { auth } form "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
    params
}: { params: {courseId: string }}) => {
    // ensure only course creator can edit course
    const { userId } = auth();
    // if no user id, redirect home
    if (!userId) {
        return redirect("/");
    }
    
    // finding a course by id in the db
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    })

    //if no course, redirect home
    if (!course) {
        redirect("/");
    }

    // array of required field for course
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    // calculate completed fields from total fields
    const completionText = `(${completedFields} / ${totalFields})`;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>

                </div>
            </div>
        </div>
    )
}

export default CourseIdPage;