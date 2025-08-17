import { ArchiveListProps, Chatroom } from "@/types/chatroom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Archive, Calendar, MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { calculatePagination, handleRestore, useSearchChatrooms } from "@/hooks/chatroom/use-chat-functions";
import { DeleteDialog } from "./delete-dialog";
import { usePage } from "@inertiajs/react";
import { FlashAlert } from "./flash-alert";
import { useState } from "react";
import SearchInput from "./search-input";
import PaginateChatrooms from "./paginate-chatrooms";

export default function ArchivedRooms({ archivedChatrooms, processing, patch, destroy }: ArchiveListProps) {
    const { flash } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredChatrooms = useSearchChatrooms(archivedChatrooms, searchQuery)
    
    // Calculate pagination using utility function
    const {
        totalPages,
        currentItems: currentChatrooms,
    } = calculatePagination(filteredChatrooms, currentPage, 10);

    return (<>

        <FlashAlert flash={flash} />

        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {currentChatrooms.map((chatroom: Chatroom) => (

            <Card key={chatroom.id} className="w-full">
                <CardHeader className="pb-0">
                    <div className="flex items-start justify-between">

                        <div className="space-y-1">
                            <CardTitle className="text-md flex items-center  gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                {chatroom.name}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex text-xs items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Created: {new Date(chatroom.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Archive className="h-3 w-3" />
                                    Archived: {new Date(chatroom.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="pt-0 ">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(chatroom.id, patch)}
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Restore
                        </Button>

                        <DeleteDialog
                            chatroomId={chatroom.id}
                            chatroomName={chatroom.name}
                            processing={processing}
                            destroy={destroy}
                            setCurrentPage={setCurrentPage}
                        />

                    </div>
                </CardContent>
            </Card>
        ))}

        <PaginateChatrooms
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            resetTrigger={searchQuery}
        />

    </>)
}