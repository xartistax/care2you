// components/ProfilePage.tsx (Client Component)
'use client';

import { Box } from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';

const ProfilePage = () => {
  const { user, isLoaded } = useUser();

  // Fade-in effect when the content has loaded

  if (!isLoaded) {
    return <div>Loading...</div>; // You can add a loading spinner or message here
  }

  if (!user) {
    throw new Error('User not found');
  }

  return (

    <Box
      p={8}
      bg="white"
      borderRadius="lg"
      maxWidth="800px"
      margin="0 auto"
    >
      User ProfilePage
    </Box>
  );
};

export default ProfilePage;
