import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageSearch, Contact, Factory, MessageCircle } from 'lucide-react';
import AppLogo from './app-logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Chatroom } from '@/types/chatroom';

const baseNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    // },

];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },

];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props

    const mainNavItems: NavItem[] = [
        ...baseNavItems,
        ...(auth.user as any).chatrooms.map((chatroom: Chatroom) => ({
            title: chatroom.name,
            href: '/chatrooms/' + chatroom.id,
            icon: MessageCircle 
        }))
    ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton size="xl" asChild>
                        {/* <SidebarMenuButton size="lg" asChild> */}
                                {/* <span className="justify-start"> */}
                                <Link href='/dashboard'>
                                <img
                                    // src='/millennium_logo_svg.svg'
                                    src='/CLSU_MONOCHROME.png'
                                    alt='Millennium AI'
                                    className='h-20 dark:filter  invert dark:invert-0' 
                                    />
                                    {/* <span className='ml-2'>Millennium AI</span> */}
                                    <span className='ml-2 text-2xl font-bold'>Siel AI</span>
                                </Link>
                                {/* </span> */}
                        </SidebarMenuButton>
                    </SidebarMenuItem>


                    {/* removeed sidebar trigger */}

                    {/* <SidebarMenuItem> 
                        <SidebarMenuButton size="lg" 
                            // className='justify-start' 
                            asChild
                         >
                                <SidebarTrigger/> 
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}

                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>

                <NavMain items={mainNavItems} />
            </SidebarContent>
                {/* inside NavMain tells us if the user has chatrooms */}

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
