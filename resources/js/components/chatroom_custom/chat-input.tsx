import { SendHorizonal } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { handleSubmit } from "@/hooks/chatroom/use-chat-functions"

interface ChatInputProps {
    processing: any;
    post: any;
    data: any;
    setData: any;
    // handleSubmit: any;
}

// export function ChatInput({ processing, post, data, setData, handleSubmit }: ChatInputProps) {
export function ChatInput({ processing, post, data, setData }: ChatInputProps) {
    return (<>
        {/* Input Area */}
        <div className="border-0 pt-4 mt-auto">
            <div className="flex space-x-2">
                <Input
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(post, setData, data)
                        }
                    }}

                    placeholder="Type your message..." className="flex-1"
                />

                <Button
                    onClick={() => handleSubmit(post, setData, data)}
                    disabled={processing}
                    variant="ghost"
                    size="icon"
                >
                    <SendHorizonal className="h-8" />
                </Button>
            </div>
        </div>
    </>)
}