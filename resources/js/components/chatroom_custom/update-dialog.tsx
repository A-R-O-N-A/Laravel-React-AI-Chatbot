import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface UpdateDialogProps {
    chatroom: any;
    children?: React.ReactNode;
}

export function UpdateDialog({ chatroom, children }: UpdateDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        name: chatroom.name || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.name.trim()) {
            return;
        }

        patch(route('chatrooms.update', chatroom.id), {
            onSuccess: () => {
                console.log('Chatroom name updated successfully');
                setIsOpen(false);
            },
            onError: (error) => {
                console.log('Update failed:', error);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // Reset form when opening
            setData('name', chatroom.name || '');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Update Name
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Update Chat Name</DialogTitle>
                        <DialogDescription>
                            Change the name of this chatroom. This will help you identify it better in your chat list.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="col-span-3"
                                placeholder="Enter chatroom name"
                                maxLength={100}
                                autoFocus
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-500 col-span-4 text-right">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.name.trim() || data.name === chatroom.name}
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            {processing ? 'Updating...' : 'Update Name'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}