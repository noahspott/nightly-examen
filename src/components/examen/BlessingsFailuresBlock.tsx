import { useState, useRef, useEffect } from "react";

interface BlessingsFailuresBlockProps {
  title: string;
  firstInputPlaceholder: string;

  inputs: string[];
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;

  tags: string[]; 
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function BlessingsFailuresBlock({ title, firstInputPlaceholder, inputs, setInputs, tags, setTags }: BlessingsFailuresBlockProps) {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Effect to handle focusing when focusIndex changes
  useEffect(() => {
    if (focusIndex !== null && textareaRefs.current[focusIndex]) {
      textareaRefs.current[focusIndex]?.focus();
      setFocusIndex(null); // Reset focus index after focusing
    }
  }, [focusIndex]);

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Inputs */}
      <ul className="flex flex-col gap-2 mt-4">
        {inputs.map((input, index) => (
          <li key={index} className="border-b-2 border-white/10 flex items-start">
            <textarea
              ref={(el) => {textareaRefs.current[index] = el}}
              className="bg-transparent py-2 w-full text-wrap flex-1 focus:outline-none resize-none h-10 min-h-10 overflow-hidden"
              placeholder={firstInputPlaceholder}
              value={input}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[index] = e.target.value;
                setInputs(newInputs);
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // if the string is empty, consider the user is done typing
                  if (input.trim() === '') {
                    setFocusIndex(null);
                    // Is there a way to close the keyboard on mobile?
                    (e.target as HTMLTextAreaElement).blur();
                    return;
                  }
                  const newInputs = [...inputs];
                  newInputs.splice(index + 1, 0, ''); // Insert new empty input after current
                  setInputs(newInputs);
                  setFocusIndex(index + 1); // Set focus to the new textarea
                }
                // If the user backspaces on an empty input, remove the input unless it's the first input, and send the focus to the previous input
                if (e.key === 'Backspace' && input.trim() === '' && index !== 0) {
                  const newInputs = [...inputs];
                  newInputs.splice(index, 1);
                  setInputs(newInputs);
                  setFocusIndex(index - 1);
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
