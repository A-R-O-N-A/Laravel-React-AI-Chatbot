import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { NewChatDialog } from '@/components/chatroom_custom/new-chat-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquarePlus, Sparkles } from 'lucide-react';
import { FlashAlert } from '@/components/chatroom_custom/flash-alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { flash } = usePage().props as any;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <FlashAlert flash={ flash }/>

            <div className="flex h-full items-center justify-center p-8">
                <Card className="w-full max-w-2xl">
                    <CardContent className="p-12 text-center space-y-8">
                        
                        {/* Hero Icon */}
                            <div className="flex justify-center">

                                <img
                                    // src='/millennium_logo_svg.svg'
                                    src='/CLSU_MONOCHROME.png'
                                    // alt='illennium AI'
                                    alt='Siel AI'
                                    // className='h-40 dark:filter dark:brightness-0 dark:invert' 
                                    className='h-40 dark:filter invert dark:invert-0' 
                                    />                        
                            </div>

                        {/* Hero Text */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Badge variant="secondary" className="mb-4">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Powered by Llama 3.2
                                </Badge>
                                <h1 className="text-4xl font-bold tracking-tight">
                                    {/* Welcome to Millennium AI */}
                                    Welcome to Siel AI
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                                    {/* Your intelligent conversation partner. Start chatting to get help with anything you need. */}
                                    Powered by RAG
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <NewChatDialog>
                                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                                    <MessageSquarePlus className="h-5 w-5 mr-3" />
                                    Start New AI Conversation
                                </Button>
                            </NewChatDialog>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}