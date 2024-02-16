"use client"; 

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";

import { FileUpload } from "@/components/file-upload";

// validate form with zod schema validation
const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});
interface ImageFormProps {
    initialData: Course
    courseId: string;
};

export const ImageForm = ({
    initialData,
    courseId,
}: ImageFormProps ) => {
    // state for keeping track of editing Description: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Image Added Successfully");
            // call toggle state to change from cancel to edit
            toggleEdit();
            // useRouter.refresh() re-renders the page component by refetching the course
            // from the database and not refreshing the entire page.
            router.refresh();
        } catch {
            toast.error("Something went wrong!")
        }
    };

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>
                            Cancel
                        </>
                    )}
                    {!isEditing  && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ration recommended
                    </div>
                </div>
            )}
        </div>
     );

     
}
