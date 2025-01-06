import {
  Box,
  type BoxProps as ChakraBoxProps,
  Heading,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';

type CardRootProps = {
  asChild?: boolean;
} & ChakraBoxProps;

export const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  (props, ref) => {
    return (
      <Box
        ref={ref}
        as="div" // ✅ Ensures it's treated as a div
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="md"
        {...props}
      >
        {props.children}
      </Box>
    );
  },
);

type CardHeaderProps = {} & ChakraBoxProps;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    return (
      <Box ref={ref} p="4" borderBottom="1px solid" borderColor="gray.200" {...props}>
        {props.children}
      </Box>
    );
  },
);

type CardBodyProps = {} & ChakraBoxProps;

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    return (
      <Box ref={ref} p="4" {...props}>
        {props.children}
      </Box>
    );
  },
);

type CardFooterProps = {} & ChakraBoxProps;

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    return (
      <Box
        ref={ref}
        p="4"
        borderTop="1px solid"
        borderColor="gray.200"
        display="flex"
        justifyContent="space-between"
        {...props}
      >
        {props.children}
      </Box>
    );
  },
);

type CardTitleProps = {} & ChakraBoxProps;

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  (props, ref) => {
    return (
      <Heading ref={ref} as="h3" size="md" mb="2" {...props}>
        {props.children}
      </Heading>
    );
  },
);

type CardDescriptionProps = {} & ChakraBoxProps;

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>((props, ref) => {
  return (
    <Text ref={ref} fontSize="sm" color="gray.600" {...props}>
      {props.children}
    </Text>
  );
});
