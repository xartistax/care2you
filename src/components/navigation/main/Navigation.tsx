'use client';
import Link from 'next/link';

import type { NavLink } from './navLinks';
import { getNavLinks } from './navLinks';

type NavigationProps = {
  userRole: string;
  onNavigate?: () => void;
};

export default function Navigation({ userRole, onNavigate }: NavigationProps) {
  const navLinks: NavLink[] = getNavLinks(userRole);

  return (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="flex items-center gap-x-2 border-none text-gray-700 hover:text-gray-900"
            onClick={onNavigate}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        </li>
      ))}
    </>
  );
}
