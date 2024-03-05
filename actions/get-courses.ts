import { Course, Category } from '@prisma/client';
import { getProgress } from './get-progress';
import { db } from '@/lib/db';

// custom type to combine  each course with the progress user made.
type CourseWithProgressWithCategory = Course & { 
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null;
};

// create a type for function to accept userId, title adn category id for search
type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const GetCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses ): Promise<CourseWithProgressWithCategory[]> => {
        try {
            // get published courses
            const courses = await db.course.findMany({
                where: {
                    isPublished: true,
                    title: {
                        contains: title
                    },
                    categoryId,
                },
                include: {
                    category: true,
                    chapters: {
                        where: {
                            isPublished: true,
                        },
                        select: {
                            id: true
                        }
                    },
                    purchases: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
                courses.map(async course => {
                    if (course.purchases.length === 0) {
                        return {
                            ...course,
                            progress: null,
                        }
                    }

                    const progressPercentage = await getProgress(userId, course.id);

                    return {
                        ...course,
                        progress: progressPercentage,
                    }
                })
            );

            return coursesWithProgress;

        } catch (err) {
            console.log("[GETCOURSES_ERROR]", err);
            return [];
        }
}