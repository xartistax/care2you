import { Button, Link } from '@chakra-ui/react';
import { SignOutButton } from '@clerk/nextjs';
import type { z } from 'zod';

import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

import CoinIcon from '../header/CoinIcon';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

type ProfileUserLinkProps = {
  user: OnBoardingClientUser;
};

export default function ProfileUserLink({ user }: ProfileUserLinkProps) {
  if (user.privateMetadata.role === 'service') {
    return ( // ✅ Fixed missing return

      <MenuRoot>
        <MenuTrigger asChild>

          <Button variant="ghost" size="sm" fontWeight="bold">
            {`${user.lastName} ${user.firstName}`}
            {' '}

            {
              user.privateMetadata.credits as number > 0
                ? (
                    <span className="flex items-center">
                      {' ( '}
                      <CoinIcon />
                      {user.privateMetadata.credits as string}
                      {' '}
                      Credits
                      {' ) '}
                    </span>

                  )
                : (null)
            }

          </Button>

        </MenuTrigger>
        <MenuContent>
          <MenuItem value="rename">
            <Link href="/user-profile">
              UserProfil
            </Link>

          </MenuItem>
          <SignOutButton redirectUrl="/good-bye">
            <MenuItem
              value="logout"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
            >
              Abmelden
            </MenuItem>
          </SignOutButton>

        </MenuContent>
      </MenuRoot>
    );
  } else {
    return (

      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="ghost" size="sm" fontWeight="bold">
            {`${user.lastName} ${user.firstName}`}
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="rename">

            <Link href="/user-profile">
              Userprofil
            </Link>

          </MenuItem>
          <SignOutButton redirectUrl="/good-bye">
            <MenuItem
              value="logout"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
            >
              Abmelden
            </MenuItem>
          </SignOutButton>

        </MenuContent>
      </MenuRoot>
    );
  }
}
