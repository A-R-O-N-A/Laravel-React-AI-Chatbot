import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export default function DocumentResultsHeader({ selectedResult, setSelectedResult }: any) {
    return (
        <DialogHeader>


            <DialogTitle>
                {selectedResult && (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => setSelectedResult(null)}
                    >
                        <ArrowLeft />
                    </Button>
                )}

            </DialogTitle>

            {!selectedResult && (
                <DialogDescription>
                    Documents retrieved from your knowledge base for this query.
                </DialogDescription>
            )}

        </DialogHeader>
    )
}