// En Textarea.tsx
import * as React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="w-full rounded-md border border-gray-300 p-2"
      {...props}
    />
  );
}

export { Textarea }; // Named export
export default Textarea; // También mantén el default export