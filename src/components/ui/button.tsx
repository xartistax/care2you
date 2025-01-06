import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import {
  Button as ChakraButton,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';

type ButtonLoadingProps = {
  loading?: boolean;
  loadingText?: React.ReactNode;
};

export type ButtonProps = {} & ChakraButtonProps & ButtonLoadingProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { loading, disabled, loadingText, children, ...rest } = props;

    return (
      <ChakraButton
        disabled={loading || disabled}
        ref={ref}
        {...rest}
      >
        {loading
          ? (
              <HStack>
                <Spinner size="sm" />
                {loadingText || children}
              </HStack>
            )
          : (
              children
            )}
      </ChakraButton>
    );
  },
);
