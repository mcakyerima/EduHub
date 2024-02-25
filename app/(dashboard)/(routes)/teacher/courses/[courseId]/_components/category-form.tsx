"use client"; 

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";


interface CategoryFormProps {
    initialData: Course
    courseId: string;
    options: { label: string; value: string }[];
};

// validate form with zod schema validation
const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({
    initialData,
    courseId,
    options,
}: CategoryFormProps ) => {
    // state for keeping track of editing Description: if editing, show editing else show the title
    const [ isEditing, setIsEditing ] = useState(false);

    // A sinple toggle for the title editing state
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },

    });


    // destructure the submitting and valid states
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Category added successfully");
            // call toggle state to change from cancel to edit
            toggleEdit();
            // useRouter.refresh() re-renders the page component by refetching the course
            // from the database and not refreshing the entire page.
            router.refresh();
        } catch {
            toast.error("Something went wrong!")
        }
    };

    const selectedOption = options.find((option) => option.value === initialData?.categoryId);
    // console.log("SELECTED OPTION", selectedOption);
    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                    { selectedOption?.label || "No Category"}
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
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
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
