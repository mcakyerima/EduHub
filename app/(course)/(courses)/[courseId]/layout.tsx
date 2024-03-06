import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";


const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { courseId: string }
}) => {

    const { userId } = auth();
    
    if (!userId) {
        redirect("/");
    }

    // fetch course with its ID, and display to student.
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
                },
              orderBy: {
                position: "asc"
              }    
            }
        }
    });

    if (!course) {
        return redirect("/");
    }

    console.log("[COURSE]", course);

    return (
        <div>
            {children}
        </div>
    )
}

export default CourseLayout;