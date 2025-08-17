import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface NewChatDialogProps {
    children?: React.ReactNode;
    className?: string;
}

export function NewChatDialog({ children, className }: NewChatDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = () => {
        post(route('chatrooms.store'), {
            onSuccess: () => {
                setOpen(false);
                setData('name', '');
            },
            onError: (errors) => {
                console.log('Submission errors:', errors);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className={className}>
                        <SquarePen className="h-4 w-4 mr-2" />
                        New Chat
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Chat Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter chat name..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && data.name.trim()) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button 
                            onClick={() => {
                                setOpen(false);
                                setData('name', '');
                            }}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        disabled={processing || !data.name.trim()}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Creating...' : 'Create Chat'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}