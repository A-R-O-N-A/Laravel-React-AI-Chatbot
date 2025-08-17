import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SidebarSearchInputProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function SidebarSearchInput({ searchQuery, setSearchQuery }: SidebarSearchInputProps) {
    return (
        <div className="relative mb-4 mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search chatrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-8 text-sm"
            />
            {searchQuery && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}