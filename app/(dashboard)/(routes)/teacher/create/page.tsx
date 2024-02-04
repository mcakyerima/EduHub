"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import {
    Form,
    FormDescription,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


// create a form schema
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

const CreatePage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    return ( 
        <div>
            Create Page
        </div>
     );
}
 
export default CreatePage;