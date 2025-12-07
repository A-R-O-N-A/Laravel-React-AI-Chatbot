import { AutoScrollProps, Chatroom, PaginationCalculation } from "@/types/chatroom"
import { useEffect, useMemo } from "react"

export const calculatePagination = (
    items: any[],
    currentPage: number,
    itemsPerPage: number
): PaginationCalculation => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
        totalPages,
        startIndex,
        endIndex,
        currentItems,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        totalItems: items.length,
    };
};

export const handleSubmit = (post: any, setData: any, data: any) => {

    // blank out the input box
    setData({
        ...data,
        content: '',
    })

    // create and send the user message first 
    post(route('messages.store'), {
        onSuccess: () => {

            // process the ai message after displaying on screen
            // post(route('messages.send_ai'))
            post(route('messages.send_ai_fastapi'))
        },
        onError: (errors: any) => {
            console.log('Errors sending message : ', errors)
        }
    })
}

export const handlePermanentDelete = (chatroomId: number, destroy: any) => {

    destroy(route('chatrooms.destroy', chatroomId), {
        onSuccess: () => {
            console.log('Chatroom permanently deleted');
        },
        onError: (errors: any) => {
            console.error('Delete failed:', errors);
        }
    });
}

// exception use case
export const handlePermanentDeletePagedItem = (chatroomId: number, destroy: any, setCurrentPage: any) => {

    destroy(route('chatrooms.destroy', chatroomId), {
        onSuccess: () => {
            setCurrentPage(1); // Reset to page 1 after delete
            console.log('Chatroom permanently deleted');
        },
        onError: (errors: any) => {
            console.error('Delete failed:', errors);
        }
    });
}

export const handleRestore = (chatroomId: number, patch: any) => {

    patch(route('chatrooms.unarchive', chatroomId), {
        onSuccess: () => {
            console.log('Chatroom restored successfully');
        },
        onError: (errors: any) => {
            console.error('Restore failed:', errors);
        }
    });
}

export const useAutoScroll = ({ messagesEndRef, messages }: AutoScrollProps) => {
    // auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
}

export const useUpdateChatroomID = ({ chatroom, setData }: any) => {
    // ensure to refresh the setData's data.chatroom.id whenever we change the p[age]
    useEffect(() => {
        setData('chatroom_id', chatroom.id)
    }, [chatroom.id])
}

export const useSearchChatrooms = (
    archivedChatrooms: Chatroom[], 
    searchQuery: string
) => {
    return useMemo(() => {
        if (!searchQuery.trim()) return archivedChatrooms;

        const lowerCaseQuery = searchQuery.toLowerCase();
        return archivedChatrooms.filter(chatroom =>
            chatroom.name.toLowerCase().includes(lowerCaseQuery)
        );
    }, [archivedChatrooms, searchQuery]);
}

export const useSearchSidebarItems = (items: any[], searchQuery: string) => {
    return useMemo(() => {
        if (!searchQuery.trim()) {
            return items;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        return items.filter(item =>
            item.title.toLowerCase().includes(lowerCaseQuery)
        );
    }, [items, searchQuery]);
}
