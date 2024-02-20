"use client"; 

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Attachment } from "@prisma/client";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";

import { FileUpload } from "@/components/file-upload";

// validate form with zod schema validation
const formSchema = z.object({
    url: z.string().min(1),
});
interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[]};
    courseId: string;
};

export const AttachmentForm = ({
    initialData,
    courseId,
}: AttachmentFormProps ) => {
    // state for keeping track of editing Description: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // create a state for spinner when deleting attachment file.
    const [ deletingId, setDeletingId ] = useState< string | null>(null);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);

    // useRouter to refresh components after db transaction
    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Attachment Added Successfully");
            // call toggle state to change from cancel to edit
            toggleEdit();
            // useRouter.refresh() re-renders the page component by refetching the course
            // from the database and not refreshing the entire page.
            router.refresh();
        } catch {
            toast.error("Something went wrong!")
        }
    };

    // onClick function to handle attachment delete if the X button is clicked
    const onDelete = async (id:string) => {
        try {
            // set the deleting id to the current file id
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch(error) {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachment
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>
                            Cancel
                        </>
                    )}
                    {!isEditing  && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500">
                            No attachments yet
                        </p>
                    )}
                    { initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 flex-shrink-0"/>
                                    <p className="text-xs line-clamp-1 ml-2">
                                        {attachment.name}
                                    </p>
                                    { deletingId === attachment.id && (
                                        <div className="ml-auto">
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        </div>
                                    )}
                                    { deletingId !== attachment.id && (
                                        <button 
                                            className="ml-auto"
                                            onClick={() => onDelete(attachment.id)}
                                            >
                                            <X className="w-4 h-4 hover:opacity-75 transition"/>
                                        </button>)}
                                </div>
                            ))}
                        </div>
                    )  }
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url : url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add any course resources here.
                    </div>
                </div>
            )}
        </div>
     );

     
}
