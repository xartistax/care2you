import { ClipboardIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

export type NavLink = { href: string; label: string; icon: any };

export const NAV_LINKS: Record<string, NavLink[]> = {
  service: [
    {
      href: '/de/welcome/new/service',
      label: 'Service erstellen',
      icon: PlusCircleIcon,
    },
    {
      href: '/de/welcome/new/care',
      label: 'Services',
      icon: ClipboardIcon,
    },
  ],
  client: [
    {
      href: '/de/welcome/new/care',
      label: 'Services',
      icon: ClipboardIcon,
    },
    {
      href: '/de/welcome/new/care/calculator',
      label: 'Neue Pflege',
      icon: ClipboardIcon,
    },
  ],
};

export function getNavLinks(role: string): NavLink[] {
  return NAV_LINKS[role] || [];
}
