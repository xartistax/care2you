'use client';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Entrance({ title, text, linkTo, linkTitle }: { title: string; text: string; linkTo: string; linkTitle: string }) {
  const router = useRouter();
  return (
    <Flex
      // Light background to contrast the box
      minHeight="100vh" // Full viewport height
      align="center" // Vertical centering
      justify="center" // Horizontal centering
      p={4} // Padding for smaller screens
    >
      <Box
        bg="white"

        maxWidth="800px"
        width="100%" // Responsive width
        p={8}
      >
        <VStack>
          <Text fontSize="3xl" fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" textAlign="center">
            {text}
          </Text>
          <Button
            mt={12}
            colorScheme="teal"
            size="md"
            onClick={() => router.push(`/de${linkTo}`)}
          >
            {linkTitle}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
