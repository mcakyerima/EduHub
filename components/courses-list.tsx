import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
// define a type for our courses
type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

// add an interface to that.
interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    items.map((item) => {
        console.log("ITEMS: ", item);
    })
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.id}>
                        <CourseCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={item.imageUrl!}
                            price={item.price!}
                            chaptersLength={item.chapters.length}
                            progress={item.progress}
                            category={item?.category?.name!}
                        /> 
                    </div>
                ))}
            </div>
            {items.length === 0  && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    )
}