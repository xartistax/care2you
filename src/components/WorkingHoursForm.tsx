import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { HStack, Text } from '@chakra-ui/react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'; // Make sure this matches the TimeRangePicker you're using.
import React, { useEffect } from 'react';

import { Switch } from './ui/switch';

type WorkingHoursProps<T extends string> = {
  workingHours: {
    [day in T]: {
      enabled: boolean;
      hours: [string, string];
    };
  };
  onToggle: (day: T) => void;
  onTimeChange: (day: T, value: [string, string]) => void;
  label?: string; // Optional label for customization
};

const WorkingHoursForm = <T extends string>({
  workingHours,
  onToggle,
  onTimeChange,
  label = 'Verfügbarkeiten',
}: WorkingHoursProps<T>) => {
  useEffect(() => {
    // Force a re-render or update state when the component mounts
    // You can log the values to ensure they are being passed correctly
    // console.log('Time range picker mounted with value');
  }, []);

  return (
    <FormControl w="100%">
      <FormLabel fontSize="small" fontWeight="bold">
        {label}
      </FormLabel>
      {Object.keys(workingHours).map((day) => {
        const dayKey = day as T; // Explicitly cast `day` to `T`
        const dayData = workingHours[dayKey];

        if (!dayData) {
          return null;
        }

        return (
          <HStack key={`${day}-${dayData.enabled}`} w="100%" paddingBottom={4}>
            <HStack w="100%" opacity={1}>
              <Switch
                defaultChecked={dayData.enabled}
                onChange={() => onToggle(dayKey)}
                colorScheme="blue"
              />
              <Text fontSize="sm">{day}</Text>
            </HStack>

            <TimeRangePicker
              value={dayData.hours ?? ['08:00', '16:00']}
              onChange={(value) => {
                if (
                  Array.isArray(value)
                  && value.length === 2
                  && typeof value[0] === 'string'
                  && typeof value[1] === 'string'
                ) {
                  onTimeChange(dayKey, value as [string, string]);
                } else {
                  console.warn('Invalid time range value:', value);
                  onTimeChange(dayKey, ['08:00', '16:00']);
                }
              }}
              disableClock
              locale="de-DE"
              format="HH:mm"
              clearIcon={null}
              disabled={!dayData.enabled}
              className={`time-picker ${!dayData.enabled ? 'time-picker-disabled' : ''}`}
            />

          </HStack>
        );
      })}
    </FormControl>
  );
};

export default WorkingHoursForm;
