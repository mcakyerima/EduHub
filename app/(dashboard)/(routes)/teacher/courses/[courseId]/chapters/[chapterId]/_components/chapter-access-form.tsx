"use client"; 

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormDescription
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";

// validate form with zod schema validation
const formSchema = z.object({
    isFree : z.boolean().default(false),
});
interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
};

export const ChapterAccessForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterAccessFormProps ) => {
    // state for keeping track of editing Chapter Description: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree : Boolean(initialData.isFree) // another way to check boolean using (!!) !!initialData.isFree
        },
    });


    // destructure the submitting and valid states
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated successfully");
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
                Chapter access
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.isFree && "text-slate-500 italic"
                )}>
                    {initialData.isFree ? (
                        <>This chapter is free for preview</>
                    ) : (
                        <>This chapter is not free</>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"  
                    >
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({field}) => (
                               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chapter free for preview
                                        </FormDescription>
                                    </div>
                               </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
     );    
} 