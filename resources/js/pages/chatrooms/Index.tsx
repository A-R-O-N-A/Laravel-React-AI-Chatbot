import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import { RightSidebar } from "@/components/chatroom_custom/right-sidebar";
import MessageBubble from "@/components/chatroom_custom/message-bubble";
import { LoadingBubble } from "@/components/chatroom_custom/loading-bubble";
import { ChatInput } from "@/components/chatroom_custom/chat-input";
import { useAutoScroll, useUpdateChatroomID } from "@/hooks/chatroom/use-chat-functions";
import { ChatroomProps } from "@/types/chatroom";

export default function Index() {
    const { chatroom, messages } = usePage<ChatroomProps>().props
    const { data, setData, post, processing } = useForm({
        chatroom_id: chatroom.id,
        content: '',
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useAutoScroll({ messagesEndRef, messages })
    useUpdateChatroomID({ chatroom, setData })

    return (
        <AppLayout >
            <Head title='Chatroom' />

            {/* <FlashAlert flash={ flash }/> */}

            <div className="h-screen border-0 flex flex-col p-4 pr-64 ">
                <div className="border-0 flex-1 overflow-y-auto p-1 ">

                    <Card className="border-0 flex-1 flex flex-col">
                        <CardContent className="flex-1 flex flex-col p-4  space-y-4">

                            <MessageBubble messages={messages} />

                            <LoadingBubble processing={processing} />

                            {/* autoscroll to this point */}
                            <div ref={messagesEndRef} />

                        </CardContent>
                    </Card>
                </div>

                <ChatInput
                    processing={processing}
                    post={post}
                    data={data}
                    setData={setData}
                />

            </div>

            <RightSidebar chatroom={chatroom} />
        </AppLayout>
    )
}