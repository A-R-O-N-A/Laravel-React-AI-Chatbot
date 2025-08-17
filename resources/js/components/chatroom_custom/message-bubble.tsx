import { Card, CardContent } from "../ui/card";
import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ messages }: { messages: any }) {
    return (<>
        {messages.map((message: any) => {
            return (<>

                {message.role == 'user'
                    ? <>

                        {/* USER */}
                        <div className="flex justify-end">
                            <div className="flex flex-col items-end max-w-xs ">

                                <Card className="bg-primary text-primary-foreground border-0 p-2 max-w-md">
                                    <CardContent className="p-2">
                                        <p className="text-s">{message.content}</p>
                                        <p className="text-xs text-primary-foreground/70 mt-2">
                                            {new Date(message.created_at).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>

                    </>
                    : <>

                        {/* AI ASSISTANT */}
                        <div className="flex justify-start">
                            <Card className="bg-muted border-0 max-w-md p-2">
                                <CardContent className="p-2">
                                    {/* <p className="text-sm text-muted-foreground">{message.content}</p> */}

                                    <ReactMarkdown
                                        components={{
                                            // Customize markdown components
                                            p: ({ children }) => <p className="mb-2 text-s last:mb-0">{children}</p>,
                                            code: ({ children }) => (
                                                <code className="bg-muted-foreground/10 px-1 py-0.5 rounded text-xs font-mono">
                                                    {children}
                                                </code>
                                            ),
                                            pre: ({ children }) => (
                                                <pre className="bg-muted-foreground/10 p-2 rounded text-s font-mono overflow-x-auto">
                                                    {children}
                                                </pre>
                                            ),
                                            ul: ({ children }) => <ul className="list-disc text-s list-inside mb-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal text-s list-inside mb-2">{children}</ol>,
                                            li: ({ children }) => <li className="mb-2 text-s">{children}</li>,
                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-s">{children}</em>,
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                    <p className="text-xs text-muted-foreground/70 mt-2">
                                        {new Date(message.created_at).toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                    </>
                }
            </>)
        })}

    </>)
}