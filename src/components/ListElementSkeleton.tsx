import {
  Box,
  CardBody,
  CardRoot,
  LinkBox,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

import { SkeletonText } from './ui/skeleton';

export default function ListElementSkeleton() {
  return (
    <LinkBox
      as={CardRoot}
      height="auto"
      minHeight="150px"
      width="full"
      borderRadius="md"
      _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      mb={4}
    >
      <CardBody
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'stretch', md: 'center' }}
        gap="4"
        width="100%"
        height="100%"
      >
        {/* Background Image Skeleton */}
        <Box
          flexShrink={0}
          width={{ base: '100%', md: '150px' }}
          height={{ base: '200px', md: '120px' }}
          borderRadius="md"
          overflow="hidden"
        >
          <Skeleton width="full" height="full" />
        </Box>

        {/* Text Content Skeleton */}
        <Stack flex="1" spaceY={3} justify="space-between" width="100%">
          {/* Title */}
          <Skeleton height="20px" width="70%" />

          {/* Price */}
          <Skeleton height="16px" width="50%" />

          {/* Description */}
          <SkeletonText noOfLines={2} spaceY="2" />
        </Stack>
      </CardBody>
    </LinkBox>
  );
}
