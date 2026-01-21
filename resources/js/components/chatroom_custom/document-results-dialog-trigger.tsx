import { Quote } from "lucide-react";
import { Button } from "../ui/button";

export default function DocumentResultsDialogTrigger ({resultCount, setDialogOpen}: any) {
    return (
    <Button
        variant='ghost'
        size='icon'
        className='h-7 w-7 relative'
        title="View sources"
        onClick={() => setDialogOpen(true)}
    >

        <Quote className='h-3.5 w-3.5'/>

        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {resultCount}
        </span>

    </Button>
    )
}