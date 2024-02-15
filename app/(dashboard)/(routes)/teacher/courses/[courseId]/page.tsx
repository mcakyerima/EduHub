import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";

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
    const completionText = `(${completedFields}/${totalFields})`;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="flex items-center gap-x-2">
                    <IconBadge  icon={LayoutDashboard}/>
                    <h2 className="text-xl">
                        Customize your course
                    </h2>
                </div>
                <TitleForm
                    initialData={course}
                    courseId={course.id}
                />
                <DescriptionForm
                    initialData={course}
                    courseId={course.id}
                />
            </div>

        </div>
    )
}

export default CourseIdPage;