'use client';
import { Box, Button, HStack, Table } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

type AdminPanelProps = {
  userList: OnBoardingClientUser[]; // Correctly type the userList as an array of User objects
};

export default function AdminPanel({ userList }: AdminPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

      <Table.ScrollArea borderWidth="1px" maxW="100%">

        <Table.Root key={uuidv4()} size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader minW="300px">Vorname</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px">Nachname</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px">Email</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px">Telefon</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px">Expertise</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px">Skills</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Aktionen</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {userList.map(item => (
              <Table.Row key={item.id} textAlign="start">
                <Table.Cell>{item.firstName}</Table.Cell>
                <Table.Cell>{item.lastName}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.privateMetadata.phone as string}</Table.Cell>
                <Table.Cell>{item.privateMetadata.expertise as string}</Table.Cell>
                <Table.Cell textAlign="end">{(item.privateMetadata.skill as string[]).join(', ')}</Table.Cell>
                <Table.Cell>
                  <HStack>
                    <Button size="sm" colorScheme="blue">aktivieren</Button>
                    <Button size="sm" colorScheme="blue">Dokumente Download</Button>
                  </HStack>

                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

    </Box>
  );
}
