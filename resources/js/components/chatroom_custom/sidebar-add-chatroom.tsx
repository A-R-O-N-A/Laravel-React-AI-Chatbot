import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const handleSubmit = (post: any, setOpen: any, setData: any) => {
    console.log('data submitting : ')
    post(route('chatrooms.store'), {
        onSuccess: () => {
            setOpen(false)
            setData('name', '')
        }
    })
}

export default function SidebarAddChatroom() {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        name: '',
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <SquarePen /> New Chat
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Name</Label>
                        <Input
                            type='text'
                            name='name'
                            placeholder='Chat Name'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={processing}
                        type="submit"
                        onClick={() => handleSubmit(post, setOpen, setData)}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}