'use client';

import React from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';

interface OutputReviewProps {
  moduleCode: string;
}

export const OutputReview: React.FC<OutputReviewProps> = ({moduleCode}) => {
  const handleExport = () => {
    // Implement export logic here
    const blob = new Blob([moduleCode], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'module_code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Textarea value={moduleCode} readOnly className="mb-4" />
      <Button onClick={handleExport}>Export Module Code</Button>
    </div>
  );
};
