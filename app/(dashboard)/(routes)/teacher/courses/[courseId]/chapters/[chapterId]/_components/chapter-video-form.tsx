"use client"; 

import * as z from "zod";
import axios from "axios";
import MuxPlayer from '@mux/mux-player-react';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, MuxData, Chapter } from "@prisma/client";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon, Video } from "lucide-react";
import { useState } from "react";

import { FileUpload } from "@/components/file-upload";

// validate form with zod schema validation
const formSchema = z.object({
    videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
    initialData: Chapter &  { muxData?: MuxData | null }
    courseId: string;
    chapterId: string;
};

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps ) => {
    // state for keeping track of editing Description: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Video Added Successfully");
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
                Course video
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>
                            Cancel
                        </>
                    )}
                    {!isEditing  && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Upload video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add chapter's video
                    </div>
                </div>
            )}

            { initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground">
                    Vidoes may take longer to process. consider refreshing the page if video does not appear.
                </div>
            )}
        </div>
     );

     
}
