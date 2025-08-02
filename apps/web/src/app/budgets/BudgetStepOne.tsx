'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';

interface BudgetStepOneProps {
  onNext: (data: { totalAmount: number; note: string }) => void;
  onCancel: () => void;
  initialData: { totalAmount: number; note: string };
}

export default function BudgetStepOne({ onNext, onCancel, initialData }: BudgetStepOneProps) {
  const [totalAmount, setTotalAmount] = useState(initialData.totalAmount || 0);
  const [note, setNote] = useState(initialData.note || '');

  const handleNext = () => {
    if (totalAmount > 0) {
      onNext({ totalAmount, note });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">
          Total Monthly Budget*
        </label>
        <Input
          value={totalAmount || ''}
          onChange={e => setTotalAmount(Number(e.target.value))}
          placeholder="Enter your total monthly budget"
          className="text-base"
        />
        <p className="text-muted-foreground mt-1 text-xs">
          This is the total amount you plan to spend this month
        </p>
      </div>

      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">Note (Optional)</label>
        <textarea
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
          placeholder="Add a note about your budget goals or any special considerations..."
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
          maxLength={200}
        />
        <p className="text-muted-foreground mt-1 text-xs">{note.length}/200 characters</p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          className="flex flex-1 items-center justify-center gap-2"
          disabled={totalAmount <= 0}
        >
          Next Step
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
