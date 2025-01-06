// components/ProfilePage.tsx (Client Component)
'use client';

import { Box } from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in effect when the content has loaded
  useEffect(() => {
    if (isLoaded) {
      setIsVisible(true);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>; // You can add a loading spinner or message here
  }

  if (!user) {
    throw new Error('User not found');
  }

  return (

    <Box
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
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
