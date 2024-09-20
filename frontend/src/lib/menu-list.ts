import {
  Computer,
  UserPen,
  Bell,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contenido",
      menus: [
        {
          href: "/dispositivos",
          label: "Dispositivos",
          active: pathname.includes("/dispositivos"),
          icon: Computer,
          submenus: [
            {
              href: "/dispositivos/",
              label: "Todos los dispositivos",
              active: pathname === "/dispositivos/"
            },
            {
              href: "/dispositivos/1",
              label: "Dispositivo 1",
              active: pathname === "/dispositivos/1"
            },
            {
              href: "/dispositivos/2",
              label: "Dispositivo 2",
              active: pathname === "/dispositivos/2"
            },
            {
              href: "/dispositivos/3",
              label: "Dispositivo 3",
              active: pathname === "/dispositivos/3"
            },
            {
              href: "/dispositivos/4",
              label: "Dispositivo 4",
              active: pathname === "/dispositivos/4"
            },
            {
              href: "/dispositivos/5",
              label: "Dispositivo 5",
              active: pathname === "/dispositivos/5"
            },
          ]
        },
      ]
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/cuenta",
          label: "Cuenta",
          active: pathname.includes("/cuenta"),
          icon: UserPen,
          submenus: []
        },
        {
          href: "/notificaciones",
          label: "Notificaciones",
          active: pathname.includes("/tags"),
          icon: Bell,
          submenus: []
        }
      ]
    }
  ];
}
