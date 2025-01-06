import { Button } from '@chakra-ui/react';
import { SignOutButton } from '@clerk/nextjs';

import type { OnBoardingClientUser } from '@/utils/Types'; // Import the correct type

import CoinIcon from '../header/CoinIcon';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu';

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
            <span className="flex items-center">
              {' ( '}
              <CoinIcon />
              {user.privateMetadata.credits as string}
              {' '}
              Credits
              {' ) '}
            </span>
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="rename">Profil</MenuItem>
          <SignOutButton redirectUrl="/sign-in">
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
          <MenuItem value="rename">Profil</MenuItem>
          <SignOutButton redirectUrl="/sign-in">
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
