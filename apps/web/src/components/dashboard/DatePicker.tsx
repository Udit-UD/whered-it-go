'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function DatePickerInput({
  date,
  onDateChange,
}: {
  date?: Date;
  onDateChange?: (date: Date) => void;
}) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground flex items-center justify-start gap-2 border-[#444] text-left font-normal"
        >
          <CalendarIcon className="mb-0" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={date}
          className="w-full rounded-lg"
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
