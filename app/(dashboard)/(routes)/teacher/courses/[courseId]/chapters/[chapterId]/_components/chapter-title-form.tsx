"use client"; 

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    }
    courseId: string;
    chapterId: string;
};

// validate form with zod schema validation
const formSchema = z.object({
    title: z.string().min(1),
});

export const ChapterTitleForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterTitleFormProps ) => {
    // state for keeping track of editing title: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
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
                Chapter Title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"  
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
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
