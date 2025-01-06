import type {
  CircleProps,
  SkeletonProps as ChakraSkeletonProps,
} from '@chakra-ui/react';
import { Circle, Skeleton as ChakraSkeleton, Stack } from '@chakra-ui/react';
import * as React from 'react';

export type SkeletonCircleProps = {
  size?: CircleProps['size'];
} & ChakraSkeletonProps;

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>((props, ref) => {
  const { size, ...rest } = props;
  return (
    <Circle size={size} asChild ref={ref}>
      <ChakraSkeleton {...rest} />
    </Circle>
  );
});

export type SkeletonTextProps = {
  noOfLines?: number;
} & ChakraSkeletonProps;

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (props, ref) => {
    const { noOfLines = 3, gap, ...rest } = props;
    return (
      <Stack gap={gap} width="full" ref={ref}>
        {Array.from({ length: noOfLines }).map((_, index) => (
          <ChakraSkeleton
            height="4"
            key={index}
            {...props}
            _last={{ maxW: '80%' }}
            {...rest}
          />
        ))}
      </Stack>
    );
  },
);

export const Skeleton = ChakraSkeleton;
