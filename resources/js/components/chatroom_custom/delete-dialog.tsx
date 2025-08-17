import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "../ui/dialog";
import { handlePermanentDelete, handlePermanentDeletePagedItem } from "@/hooks/chatroom/use-chat-functions";

interface DeleteDialogProps {
    chatroomId: number;
    chatroomName: string;
    processing: boolean;
    destroy: any;
    setCurrentPage: any;
}

export function DeleteDialog({ chatroomId, chatroomName, processing, destroy, setCurrentPage }: DeleteDialogProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const confirmDelete = () => {
        // handlePermanentDelete(chatroomId, destroy);
        handlePermanentDeletePagedItem(chatroomId, destroy, setCurrentPage);
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={processing}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
                Delete Forever
            </Button>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chatroom Forever</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete "{chatroomName}"? 
                            This action cannot be undone and all messages will be lost forever.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDelete}
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Delete Forever'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}