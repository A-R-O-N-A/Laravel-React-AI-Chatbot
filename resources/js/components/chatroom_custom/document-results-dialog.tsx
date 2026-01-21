import { Check, FileText, Quote, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import PDFPreview from "./pdf-preview";

export default function DocumentResultsDialog({ results }: any) {
    const resultCount = results?.length || 0;


    return (        <Dialog>
            <DialogTrigger asChild>

                <Button
                    variant='ghost' 
                    size='icon'
                    className='h-7 w-7 relative'
                    title="View sources"
                >
                    <Quote className="h-3.5 w-3.5" />
                    {resultCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                             {resultCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>


            <DialogContent className="max-w-2xl sm:max-w-3xl lg:max-w-4xl   ">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        RAG Query Results
                    </DialogTitle>
                    <DialogDescription>
                        Documents retrieved from your knowledge base for this query.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {results && results.length > 0 ? (
                        <div className="space-y-3">

                            {results.map((res: any, index: number) => (

                                <Card key={index} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-sm">
                                                    {res.filename || 'Untitled Document'}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Match #{index + 1}
                                            </Badge>
                                        </div>
                                        {/* <p className="text-sm text-muted-foreground line-clamp-3"> */}
                                        <p className="text-sm text-muted-foreground">
                                            {res.text_snippet || 'No preview available'}
                                        </p>
                                    </CardContent>
                                    <PDFPreview result={ res }/>
                                </Card>


                            ))}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-sm text-muted-foreground">
                                No results found.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Try uploading documents or refining your query.
                            </p>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-2" />
                            Close
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>)
}