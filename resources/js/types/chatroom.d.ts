export interface ChatroomProps {
    chatroom: {
        id: number;
        name: string;
        user_id: number;
        is_archived: boolean;
        created_at: string;
        updated_at: string;
        [key: string]: any;
    };

    messages: {
        id: number;
        text: string;
        is_unsent: boolean;
        chatroom_id: number;
        created_at: string;
        updated_at: string;
        [key: string]: any;
    };

    [key: string]: any;
}

export interface Chatroom{
    id: number;
    name: string;
    user_id: number;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface Messages {
    id: number;
    text: string;
    is_unsent: boolean;
    chatroom_id: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface ArchiveListProps {
    archivedChatrooms: Chatroom[];
    processing: boolean;
    patch: any;
    destroy: any;
}


interface PaginationCalculation {
    totalPages: number;
    startIndex: number;
    endIndex: number;
    currentItems: any[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalItems: number;
}


interface AutoScrollProps {
    messagesEndRef: any;
    messages: any;
}