import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";

import { Categories } from "./_components/categories";
import { GetCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

// interface for search params
interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}
const Search = async ({
    searchParams
}: SearchPageProps ) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }
    
    // fetch category
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await GetCourses({
        userId,
        ...searchParams
    });

    return (
        <>
            <div className="px-6 p-6 md:hidden md:mb-0 block">
                <SearchInput/>
            </div>
            <div className="p-6 space-y-5">
                {/* {categories.id} */}
                <Categories
                    items={categories}
                /> 
                <CoursesList items={courses}/>
            </div>
        </>
    )
}
 
export default Search;