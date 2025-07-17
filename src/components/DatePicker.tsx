import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '@chakra-ui/react';
import { de } from 'date-fns/locale/de';
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';

import { get18YearsAgoDate } from '@/utils/Helpers';

registerLocale('de', de);

type DatePickerHeroProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
};

export default function DatePickerHero({ selectedDate, onChange }: DatePickerHeroProps) {
  return (
    <div className="w-full max-w-[400px]">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd.MM.yyyy"
        placeholderText={`${get18YearsAgoDate()}`}
        locale="de"
        popperPlacement="bottom"
        customInput={<Input w="100%" />}
        wrapperClassName="w-full"
      />
    </div>
  );
}
