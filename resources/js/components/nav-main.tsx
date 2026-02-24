import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ImageIcon, ScatterChart, SquarePen } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import SidebarChatrooms from './chatroom_custom/sidebar-chartooms';
import SidebarAddChatroom from './chatroom_custom/sidebar-add-chatroom';
import FileUpload from './chatroom_custom/file-upload';
import ImageOCR from './chatroom_custom/image-ocr';

const handleSubmit = (post: any, setOpen: any, setData: any) => {
    console.log('data submitting : ')
    // post(route('chatrooms.store'))
    post(route('chatrooms.store'), {
        onSuccess: () => {
            setOpen(false)
            setData('name', '')
        }
    })
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { auth } = usePage().props as any
    const [hasChatrooms, setHasChatrooms] = useState(auth.user.chatrooms.length > 0);

    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Chatrooms</SidebarGroupLabel> */}
            <SidebarGroupLabel>{hasChatrooms ? 'Conversations' : 'No Conversations'}</SidebarGroupLabel>
            <SidebarMenu>

                {/* Create new Chatroom butom */}

                <SidebarAddChatroom />

                {/* file upload button */}

                {/* <FileUpload /> */}

                <Link href={route('ocr.page')}>
                    <Button
                        variant="ghost" size="sm" className="w-full justify-start text-sm">
                        <ImageIcon />
                        Image OCR
                    </Button>
                </Link>

                <Link href={route('data_analytics.page')}>
                    <Button
                        variant="ghost" size="sm" className="w-full justify-start text-sm">
                        <ScatterChart />
                        SIEL AI Analytics
                    </Button>
                </Link>

                {/* image OCR */}
                {/* <ImageOCR /> */}

                {/* list down the chatrooms */}

                <SidebarChatrooms
                    items={items}
                    page={page}
                />

            </SidebarMenu >
        </SidebarGroup >
    );
}
