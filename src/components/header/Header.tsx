'use client';

import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

import ProfileUserLink from '../creditsView/ProfileUserLink';
import SiteLogo from '../Logo';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

type HeaderProps = {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  user: OnBoardingClientUser;
  locale: string;
};

export default function Header({ leftNav, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const t = useTranslations('RootLayout');

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-8 lg:px-8">
        {/* Logo */}
        <div className="shrink-0">

          <SiteLogo />

        </div>

        {/* Centered Menu */}
        <PopoverGroup className="hidden grow justify-center lg:flex">
          <ul className="flex gap-x-8 text-sm ">
            {leftNav}
          </ul>
        </PopoverGroup>

        {/* Log In Button */}
        <div className="ml-auto hidden shrink-0 pr-12 lg:block">
          <ProfileUserLink user={user} />

        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  <Avatar src={user.imageUrl || '#'} name={`${user.firstName} ${user.firstName}`} size="lg" />
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-4 py-6">
                <ul className="gap-x-8  space-y-4 text-sm">
                  {leftNav}
                </ul>
              </div>
              <div className="py-6">

                <ProfileUserLink user={user} />

              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
