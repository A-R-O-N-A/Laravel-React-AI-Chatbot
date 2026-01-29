import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Upload, MessageSquare, FileText, Sparkles } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';

export default function FileVectorizePage({ response }: any) {
    const [embeddings, setEmbeddings] = useState(response?.embeddings || []);
    const [answer, setAnswer] = useState(response?.answer || '');
    const [results, setResults] = useState(response?.results || []);
    const { data, setData, post, processing, errors } = useForm({
        document: null,
        query: '',
    })

    const handleVectorizeFile = (post: any) => {
        post(route('testbed.vectorize'), {
            onSuccess: (res: any) => {
                console.log('Successfully vectorized file : ', res)
                setEmbeddings(res.props?.response?.embeddings || [])
                setAnswer(res.props?.response?.answer || '')
                setResults(res.props?.response?.results || [])
            },
            onError: (err: any) => console.log('Error vectorizing file : ', err),
        })
    }

    console.log('Response from server : ', response)

    return (<>
        <div className='min-h-screen bg-background p-6'>
            <div className='flex items-center justify-center min-h-screen'>
                <Card className='max-w-4xl w-full'>
                    <CardHeader>
                        <div className='flex items-center gap-2 mb-2'>
                            <Sparkles className='w-6 h-6' />
                            <CardTitle className='text-2xl'>Siel-AI File Vectorization</CardTitle>
                        </div>
                        <CardDescription>Upload documents and process them with AI-powered vectorization</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        {/* Upload Area */}
                        <div>
                            <Label htmlFor='document' className='text-sm font-semibold mb-3 block'>
                                Upload Document
                            </Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/50 hover:bg-muted/75 transition cursor-pointer" onClick={() => document.getElementById('document')?.click()}>
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                                <p className="font-semibold text-lg">Drag and drop your file</p>
                                <p className="text-muted-foreground text-sm mb-4">or click to browse</p>

                                <Input
                                    id='document'
                                    name='document'
                                    type='file'
                                    className='hidden'
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null
                                        setData('document', file)
                                    }}
                                />
                            </div>
                            {data.document && (
                                <p className='text-sm text-green-600 dark:text-green-500 mt-3 flex items-center gap-2 font-medium'>
                                    <CheckCircle2 className='w-4 h-4' /> {data.document.name}
                                </p>
                            )}
                        </div>

                        {/* Query Input */}
                        <div>
                            <Label className='text-sm font-semibold mb-3 block'>
                                Query / Search
                            </Label>
                            <div className='space-y-3'>
                                <Input
                                    type='text'
                                    placeholder='What would you like to find in the document?'
                                    value={data.query || ''}
                                    onChange={(e) => setData('query', e.target.value)}
                                />
                                <Button
                                    disabled={processing || !data.document}
                                    onClick={() => handleVectorizeFile(post)}
                                    className='w-full'
                                >
                                    {processing ? 'Processing...' : 'Process Document'}
                                </Button>
                            </div>
                        </div>

                        {/* Results Tabs */}
                        {(embeddings.length > 0 || answer || results.length > 0) && (
                            <Tabs defaultValue="answer" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="answer" className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Answer
                                    </TabsTrigger>
                                    <TabsTrigger value="results" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> References
                                    </TabsTrigger>
                                    <TabsTrigger value="embeddings">
                                        Vector Embeddings
                                    </TabsTrigger>
                                </TabsList>

                                {/* Answer Tab */}
                                <TabsContent value="answer" className="mt-6 space-y-4">
                                    <div className="bg-muted rounded-lg p-6 border">
                                        {answer ? (
                                            // <p className="text-foreground text-base leading-relaxed">
                                            //     {answer}
                                            // </p>
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
                                        {answer}
                                    </ReactMarkdown>
                                        ) : (
                                            <p className="text-muted-foreground text-sm text-center py-12">
                                                <em>Answer will appear here after processing.</em>
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Results Tab */}
                                <TabsContent value="results" className="mt-6">
                                    <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto border space-y-3">
                                        {results && results.length > 0 ? (
                                            results.map((result: any, index: number) => (
                                                <div key={index} className="bg-background p-4 rounded-lg border hover:border-primary transition">
                                                    <div className="flex items-start gap-2 mb-3">
                                                        <Badge variant="outline">
                                                            Match {index + 1}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        {result.text_snippet} . . .
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-sm text-center py-12">
                                                <em>Results will appear here after processing.</em>
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Embeddings Tab */}
                                <TabsContent value="embeddings" className="mt-6">
                                    <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto border space-y-3">
                                        {embeddings && embeddings.length > 0 ? (
                                            embeddings.map((embedding: any, index: number) => (
                                                <div key={index} className="bg-background p-3 rounded-lg border hover:border-primary transition">
                                                    <p className="text-xs text-muted-foreground font-mono break-all">
                                                        {embedding}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-sm text-center py-12">
                                                <em>Embeddings will appear here after processing.</em>
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </>)
}