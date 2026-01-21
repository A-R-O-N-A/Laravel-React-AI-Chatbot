import { AlignCenter, FileText, Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { Badge } from "../ui/badge";

export default function DocumentResultsList({ results, setSelectedResult }: any) {
    // const [selectedResult, setSelectedResult] = useState<any>(null)

    return (<>
        {results && results.length > 0 ? (
            <div className="space-y-3">

                {results.map((res: any, index: number) => (
                    <Card
                        key={index}
                        className='overflow-hidden cursor-point hover:shadow-md transition-shadow'
                        onClick={() => setSelectedResult(res)}
                    >
                        <CardContent className="p-4">

                            <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 text-muted-background"/>
                                <span className="font-medium text-sm">
                                    { res.filename || "Untitled Document" }
                                </span>
                            </div>

                            <Badge variant='outline' className='text-xs'>
                                Match #{index + 1}
                            </Badge>

                            <p className="text-sm text-muted-foreground">
                                {res.text_snippet || 'No preview available'}
                            </p>

                        </CardContent>
                    </Card>
                ))}

            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <Search className='h-12 w-12 text-muted-foreground/50 mb-4'/>

                <p className="text-sm text-muted-foreground">
                    No results found.
                </p>

                <p className="text-xs text-muted-foregorund mt-1">
                    Try uploading documents or refining your query.
                </p>
            </div>
        )}
    </>)
}