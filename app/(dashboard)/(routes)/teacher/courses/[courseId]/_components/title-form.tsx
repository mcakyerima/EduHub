"use-client"

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// validate form with zod schema validation
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});
interface TitleFormProps {
    initialData: {
        title: string;
    }
    courseId: string;
};

export const TitleForm = ({
    initialData,
    courseId,
}: TitleFormProps ) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    
    return ( 
        <div>
            Title Form
        </div>
     );
}
