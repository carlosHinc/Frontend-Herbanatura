export interface MenuSubmenu {
  title: string;
  icon: string;
  route: string;
  badge?: string;
  badgeColor?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  hasSubmenu: boolean;
  submenu?: MenuSubmenu[];
  badge?: string;
  badgeColor?: string;
  permission?: string;
}