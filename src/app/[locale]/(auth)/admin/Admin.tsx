/* eslint-disable no-alert */
/* eslint-disable style/multiline-ternary */

'use client';

import { Box, Heading, Input, Spinner, Table } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import type { z } from 'zod';

import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from '@/components/ui/action-bar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteUser, expertiseTypeRetriever, updateStatus } from '@/utils/Helpers';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

type AdminPanelProps = {
  userList: OnBoardingClientUser[];
};

export default function AdminPanel({ userList }: AdminPanelProps) {
  const [users, setUsers] = useState<OnBoardingClientUser[]>(userList);
  const [selection, setSelection] = useState<string[]>([]);
  const [password, setPassword] = useState(''); // Store the entered password
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(false); // Flag to check if password is correct

  const [loadingIdsDelete, setLoadingIdsDelete] = useState<string[]>([]);
  const [loadingIdsStatus, setLoadingIdsStatus] = useState<string[]>([]);

  const hasSelection = selection.length > 0;

  const indeterminate = selection.length > 0 && selection.length < users.length;

  const selectedUsers = users.filter(user => selection.includes(user.id));

  const handleStatus = async () => {
    setLoadingIdsStatus(selection); // ✅ Set loading for status action

    await Promise.all(
      selectedUsers.map(async (selectedUser) => {
        const success = await updateStatus(selectedUser.id, selectedUser.privateMetadata.status as string);
        if (success) {
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === selectedUser.id
                ? {
                    ...user,
                    privateMetadata: {
                      ...user.privateMetadata,
                      status: user.privateMetadata.status === 'inactive' ? 'active' : 'inactive',
                    },
                  }
                : user,
            ),
          );
        }
      }),
    );

    setLoadingIdsStatus([]); // ✅ Reset loading state for status change
    setSelection([]); // ✅ Uncheck all users
  };

  const handleDelete = async () => {
    setLoadingIdsDelete(selection); // ✅ Set loading for delete action

    await Promise.all(
      selection.map(async (userId) => {
        const success = await deleteUser(userId); // ✅ Await the function

        if (success) {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // ✅ Remove user from state
        }
      }),
    );

    setLoadingIdsDelete([]); // ✅ Reset loading state for delete
    setSelection([]); // ✅ Uncheck all users
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace 'yourPassword' with the password you want
    if (password === 'admin123') {
      setPasswordIsCorrect(true);
    } else {
      alert('Falsches passwort!');
    }
  };

  return (
    <Box p={8} bg="white" borderRadius="lg" maxWidth="800px" margin="0 auto">
      {!passwordIsCorrect ? (
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            Adminbereich
          </Heading>
          <form onSubmit={handlePasswordSubmit}>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Passwort"
              mb={4}
            />
            <Button type="submit" colorScheme="teal">
              Weiter
            </Button>
          </form>
        </Box>
      ) : (
        <Box>
          {/* Content to be hidden behind the password */}
          <Table.ScrollArea borderWidth="1px" maxW="100%">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="6">
                    <Checkbox
                      top="1"
                      aria-label="Select all rows"
                      checked={indeterminate ? 'indeterminate' : selection.length === users.length}
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement; // Type assertion to HTMLInputElement
                        setSelection(target.checked ? users.map(item => item.id) : []);
                      }}
                    />
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Nachname</Table.ColumnHeader>
                  <Table.ColumnHeader>E-Mail</Table.ColumnHeader>
                  <Table.ColumnHeader>Geb. Datum</Table.ColumnHeader>
                  <Table.ColumnHeader>Skills</Table.ColumnHeader>
                  <Table.ColumnHeader>Expertise</Table.ColumnHeader>
                  <Table.ColumnHeader>Rolle</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users.map(item => (
                  <Table.Row key={item.id} data-selected={selection.includes(item.id) ? '' : undefined}>
                    <Table.Cell>
                      {loadingIdsDelete.includes(item.id) || loadingIdsStatus.includes(item.id)
                        ? (
                            <Spinner size="sm" />
                          )
                        : (
                            <Checkbox
                              top="1"
                              aria-label="Select row"
                              checked={selection.includes(item.id)}
                              onChange={(e) => {
                                const target = e.target as HTMLInputElement; // Type assertion to HTMLInputElement
                                setSelection(prev =>
                                  target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id),
                                );
                              }}
                            />
                          )}
                    </Table.Cell>
                    <Table.Cell>{item.privateMetadata.status as string}</Table.Cell>
                    <Table.Cell>{item.firstName}</Table.Cell>
                    <Table.Cell>{item.lastName}</Table.Cell>
                    <Table.Cell>
                      <Link href={`mailto:${item.email}`}>{item.email}</Link>
                    </Table.Cell>
                    <Table.Cell>{item.privateMetadata.dob as string}</Table.Cell>
                    <Table.Cell>{item.privateMetadata.skill as string[]}</Table.Cell>
                    <Table.Cell>
                      {expertiseTypeRetriever((item.privateMetadata.expertise as string[])[0] as string)}
                    </Table.Cell>
                    <Table.Cell>{item.privateMetadata.role as string}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>

          <ActionBarRoot open={hasSelection}>
            <ActionBarContent>
              <ActionBarSelectionTrigger>
                {selection.length}
                {' '}
                ausgewählt
              </ActionBarSelectionTrigger>

              <ActionBarSeparator />

              <Button
                variant="outline"
                size="sm"
                onClick={handleStatus}
                loading={loadingIdsStatus.length > 0} // ✅ Spinner only for status action
              >
                {loadingIdsStatus.length > 0 ? 'Aktualisiere...' : 'Aktivieren / Deaktivieren'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                loading={loadingIdsDelete.length > 0} // ✅ Spinner only for delete action
              >
                {loadingIdsDelete.length > 0 ? 'Aktualisiere...' : 'Entfernen'}
              </Button>
            </ActionBarContent>
          </ActionBarRoot>
        </Box>
      )}
    </Box>
  );
}
