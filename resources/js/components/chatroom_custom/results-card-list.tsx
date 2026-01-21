import { Search } from "lucide-react";
import { Card } from "../ui/card";

export default function ResultsCardList({ results }: any) {
    return (<>
        {results && results.length > 0 ? (
            <Card>

                <div className="space-y-3">

                    {results.map((result: any, index: number) => (
                        <Card
                            key={index}
                            className="overflow-hidden cursor-pointer hover:"
                        >

                        </Card>
                    )) }

                </div>

            </Card>
        ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <Search className='h-12 w-12 text-muted-foreground'/>
                <p className="text-sm text-muted-foreground">
                    No Results Found.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Try uploading documents or refining your query.
                </p>
            </div>
        )}
    </>)
}
