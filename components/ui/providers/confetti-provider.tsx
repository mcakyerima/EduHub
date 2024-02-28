"use client";

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
    const confetti = useConfettiStore();

    // confetti works by continuosly dropping confettis on your app, the state
    // below confetti.isOpen is a zustan global state that is used to trigger
    // the confetti, if that state is close, we return null, else we show confetti
    // and on the confetti complete, we change that state again.
    // the confetti provider is wrapped in the app/layout page with z-index[100]
    if (!confetti.isOpen) return null;

    return (
        <ReactConfetti
            className="pointer-events-none z-[100]"
            numberOfPieces={800}
            recycle={false}
            onConfettiComplete={() => {
                confetti.onClose();
            }}
        />
    )
}