import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ArchiveDialogProps {
    chatroom: any;
    children?: React.ReactNode;
}

export function ArchiveDialog({ chatroom, children }: ArchiveDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { patch, processing } = useForm();

    const handleArchive = () => {
        patch(route('chatrooms.archive', chatroom.id), {
            onSuccess: () => {
                console.log('Chatroom archived successfully');
                setIsOpen(false);
            },
            onError: (error) => {
                console.log('Archive failed:', error);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Chat
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archive Chat</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to archive "{chatroom.name}"? 
                        You can restore it later from the archives section.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleArchive}
                        disabled={processing}
                    >
                        <Archive className="h-4 w-4 mr-2" />
                        {processing ? 'Archiving...' : 'Archive'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}