"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

import {
    Form,
    FormDescription,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// create a form schema
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

const CreatePage = () => {
// creating form hook
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    // extract the state from the forms
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return ( 
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your course
                </h1>
                <p className="text-sm text-slate-600">
                    what would you like to name your course
                </p>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advanced web development' "
                                            {...field}
                                        />

                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                            >
                                Continue
                            </Button>
                        </div>
                    </form>

                </Form>
            </div>

        </div>
     );
}
 
export default CreatePage;