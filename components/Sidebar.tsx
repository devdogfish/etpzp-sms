import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Menu,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// Menu items.
const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const timeFrames = [
  {
    title: "Today",
    description: "Messages sent today.",
  },
  {
    title: "Last week",
    description: "Messages sent this week without today.",
  },
  {
    title: "Last month",
    description: "Messages sent this month without this week.",
  },
  {
    title: "This month - 2",
    description: "Messages sent in month - 2.",
  },
  {
    title: "This month - 3",
    description: "Messages sent in month - 3.",
  },
  {
    title: "Last year (2023)",
    description: "When you reach all the months put the years.",
  },
  {
    title: "Last year - 1 (2022)",
    description: "When you reach all the months put the years.",
  },
];

export default function MySidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-min">
                <SidebarMenuButton>
                  <Menu className="" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width]"
                align="start"
              >
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className="flex items-center  gap-2 w-full"
                    >
                      <item.icon />
                      <span className="inline">{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-full">SEARCH COMPONENT</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {timeFrames.map((timeFrame) => (
          <Collapsible
            defaultOpen
            className="group/collapsible"
            key={timeFrame.title}
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {timeFrame.title}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      {/* putting the className h-full on the asChild element is the same as putting it on the first child */}
                      <SidebarMenuButton asChild>
                        <div className="flex flex-col h-full">
                          <div className="flex">
                            <div className="rounded-full aspect-1 w-4 bg-white" />
                            <p className="font-bold">MESSAGES DISPLAYED HERE</p>
                          </div>
                          <p>MORE INFO</p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>

                  {/* <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu> */}
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
