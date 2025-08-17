import { Chatroom } from "@/types/chatroom";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { useSearchSidebarItems } from "@/hooks/chatroom/use-chat-functions";
import SidebarSearchInput from "./sidebar-search";

export default function SidebarChatrooms({ items, page }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const filteredItems = useSearchSidebarItems(items, searchQuery);



    return (<>

        <SidebarSearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />

        {/* {items.map((item: any) => ( */}
        {filteredItems.map((item: any) => (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                    <Link href={item.href} prefetch>
                        {/* {item.icon && <item.icon />} */}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))}

        {/* No results state */}
        {filteredItems.length === 0 && searchQuery && (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No chatrooms found matching "{searchQuery}"
            </div>
        )}
    </>)
}