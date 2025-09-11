import * as React from "react"
import {
  BarChartIcon,
  ChartBarBig,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  CreditCard,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  NotepadText,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Logo from "@/assets/logo-panel-black.svg";
import { useNavigate } from "react-router"

const data = {
  user: {
    name: "Admin Resumid",
    email: "Admin",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Analytics Dashboard",
      url: "#",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Plans & Pricing",
      url: "#",
      icon: NotepadText,
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "User Management",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navSecondary: [
    {
      title: "Preferences",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Request Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent"

            >
              <a href="#">
                <img
                  onClick={() => navigate("/", { replace: true })}
                  className="pb-1 cursor-pointer h-8 hover:bg-red"
                  src={Logo}
                  alt="Resumid Logo"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
