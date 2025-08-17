import { Settings, Users, Info } from "lucide-react";
import { ArchiveDialog } from "./archive-dialog";
import { UpdateDialog } from "./update-dialog";
import { usePage } from "@inertiajs/react";
import { FlashAlert } from "./flash-alert";

export function RightSidebar({ chatroom }: { chatroom: any }) {
    const { flash } = usePage().props as any;

    return (
        <div className="fixed border-0 right-0 top-0 h-screen w-64 bg-background  z-0 flex flex-col">
            {/* Header */}
            <div className="p-4 border-0 border-border">
                <h3 className="font-semibold text-sm">Chat Info</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Chatroom Name */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4" />
                        <span className="font-sm">Room Details</span>
                    </div>
                    <div className="pl-6 space-y-2">
                        <div className="text-sm">
                            <p className="font-sm text-base">{chatroom.name}</p>
                            <p className="text-xs text-muted-foreground">
                                Created: {new Date(chatroom.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Archive Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Settings className="h-4 w-4" />
                        <span className="font-sm">Actions</span>
                    </div>

                    <div className="pl-6 space-y-2">
                        <UpdateDialog chatroom={chatroom} />
                        <ArchiveDialog chatroom={chatroom} />
                    </div>

                </div>

                {/* AI Model Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span className="font-sm">AI Assistant</span>
                    </div>
                    <div className="text-xs text-muted-foreground pl-6">
                        <p><strong>Model:</strong> Llama 3.2:3B</p>
                    </div>
                </div>

                <FlashAlert flash={flash} />
            </div>

        </div>
    )
}