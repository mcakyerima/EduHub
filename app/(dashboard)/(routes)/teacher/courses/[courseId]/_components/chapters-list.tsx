"use client"
import { Chapter } from "@prisma/client"
import { useState, useEffect } from "react";

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


interface ChaptersListProps{
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string; position: number}[]) => void
    items: Chapter[];
}

export const ChaptersList = ({
    onEdit,
    onReorder,
    items
}: ChaptersListProps) => {

    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);


    // fixing hydration issues due to the drag and drop component using use effect.
    useEffect(() => {
        setIsMounted(true);
    },[]);

    // Rehydrating our page using another useEffect when the page loads well
    useEffect(() => {
        setChapters(items);
    }, [items])

    if (!isMounted) {
        return null;
    }

    // createa a function to get state of draggable tabs after rearranging
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        // create an array from chapters
        const items = Array.from(chapters);
        const [ reorderedItem ] = items.splice(result.source.index, 1);
        console.log("[REORDERED_ITEM]", reorderedItem);
        items.splice(result.destination.index, 0, reorderedItem);

        console.log("ITEMS-REORDERED", items);

        // get the start index of dragged item 
        const startIndex = Math.min(result.source.index, result.destination.index);
        // get the end indes of dragged item
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
           <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        { chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished && "border-r-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-4 w-5"/>
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500",
                                                    chapter.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {chapter.isPublished ? "Publised" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={(() => onEdit(chapter.id))}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 trasition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable> 
        </DragDropContext>
    )
}