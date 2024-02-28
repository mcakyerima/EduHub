"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [ isLoading, setIsLoading ] = useState(false);

    // Event for publishing chapter.
    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course Unpublished");
                router.refresh();
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course Published");
                confetti.onOpen();
                router.refresh();
            }
        }catch {
            toast.error("Something went wrong!")
        }finally {
            setIsLoading(false);
        }
    }


    // Create an action to trigger delete on chapter delete modal
    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted successfully");

            router.refresh();
            // go back to the course page;
            router.push(`/teacher/courses`);
        }catch (error) {
            toast.error("Something went wrong!")
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>

        </div>
    )
}