import { Search, X, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

import PDFPreview from "./pdf-preview";
import DocumentResultsList from "./document-results-card-list";
import DocumentResultsDialogTrigger from "./document-results-dialog-trigger";

import { useState } from "react";

export default function DocumentResultsPreview({ results }: any) {
    const resultCount = results?.length || 0;
    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>

                <DocumentResultsDialogTrigger resultCount={resultCount} setDialogOpen={setDialogOpen}/>

            </DialogTrigger>

            <DialogContent className="max-w-2xl h-[90vh] sm:max-w-3xl lg:max-w-4xl   ">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">

                        {selectedResult && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setSelectedResult(null)}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}

                        <Search className="h-5 w-5" />
                        {selectedResult ? 'Document Preview' : 'RAG Query Results'}

                    </DialogTitle>

                    {!selectedResult && (
                        <DialogDescription>
                            Documents retrieved from your knowledge base for this query.
                        </DialogDescription>
                    )}

                </DialogHeader>

                {selectedResult ? (

                    <div className="flex-1 overflow-hidden">
                        <PDFPreview result={selectedResult} fullHeight={true} />
                    </div>

                ) : (
                    <div className="flex-1 overflow-hidden">

                        <ScrollArea className="h-full pr-4">
                            <DocumentResultsList results={results} setSelectedResult={setSelectedResult} />
                        </ScrollArea>

                    </div>
                )}

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