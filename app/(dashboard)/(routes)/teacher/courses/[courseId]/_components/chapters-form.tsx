"use client"; 

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Chapter } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// validate form with zod schema validation
const formSchema = z.object({
    title: z.string().min(1)
});

interface ChaptersFormProps {
    initialData: Course & {chapters: Chapter}
    courseId: string;
};

export const ChaptersForm = ({
    initialData,
    courseId,
}: ChaptersFormProps ) => {
    // state for keeping track of creating: if creating, show creating else show the title
    const [ isUpdating, setIsUPdating ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);

    // A sinple toggle for the title creating state
    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });


    // destructure the submitting and valid states
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created");
            // call toggle state to change from cancel to creating
            toggleCreating();
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
                Course chapters
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
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
                                            placeholder="e.g 'Course introduction'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                            <Button 
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    {/* TODO: add a list of chapters*/}
                </div>
            )}
            {!isCreating && (
                <p className="text-sm text-muted-forground mt-4">
                    Drag to rearrange the chapters
                </p>
            )}
        </div>
     );  
}