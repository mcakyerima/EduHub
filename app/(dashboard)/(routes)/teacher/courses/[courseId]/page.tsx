const CourseIdPage = ({
    params
}: { params: {courseId: string }}) => {
    return (
        <div>
            id {params.courseId}
        </div>
    )
}

export default CourseIdPage;