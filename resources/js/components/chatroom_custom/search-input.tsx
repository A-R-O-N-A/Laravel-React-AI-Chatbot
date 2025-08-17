import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchInputProps {
    searchQuery: string;
    setSearchQuery: any;
}

export default function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
    return (<>

        {/* Search Component */}
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search archived chatrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
            />
            {searchQuery && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    </>)
}