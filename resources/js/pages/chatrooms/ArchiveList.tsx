import AppLayout from "@/layouts/app-layout";
import { Head,  usePage, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";
import { Chatroom } from "@/types/chatroom";
import ArchivedRooms from "@/components/chatroom_custom/archive-list";

export default function ArchiveList() {
    const { archivedChatrooms } = usePage<Chatroom>().props;
    const { patch, delete: destroy, processing } = useForm();

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>
        <AppLayout >
            <Head title="Archived Chats" />
            
            <div className="container mx-auto p-6 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Archive className="h-6 " />
                            Archived Chats
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Manage your archived conversations
                        </p>
                    </div>
                    
                    <Badge variant="secondary" className="text-sm">
                        {archivedChatrooms.length} archived
                    </Badge>
                </div>

                {/* Content */}
                {archivedChatrooms.length === 0 ? (

                    /* Empty State */
                    <Card className="w-full">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Archive className="h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Archived Chats</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                You haven't archived any conversations yet. Archived chats will appear here.
                            </p>

                        </CardContent>
                    </Card>

                ) : (

                    /* Archive List */
                    <div className="grid gap-4">
                        <ArchivedRooms 
                            archivedChatrooms={archivedChatrooms}
                            processing={processing}
                            patch={patch}
                            destroy={destroy}
                        />

                    </div>
                )}
            </div>
        </AppLayout>
    );
}