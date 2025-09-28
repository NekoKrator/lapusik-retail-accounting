import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    ...props
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className={cn(
                    "bg-white rounded-lg shadow-lg max-w-lg w-full mx-4",
                    className
                )}
                onClick={(e) => e.stopPropagation()} // блокуємо закриття при кліку на контент
                {...props}
            >
                {title && (
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-lg">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="px-6 py-4 max-h-80 overflow-y-auto">
                    {children}
                </div>
                <div className="px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}
