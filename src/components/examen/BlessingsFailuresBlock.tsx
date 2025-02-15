import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface BlessingsFailuresBlockProps {
  title: string;
  placeholder: string;
  inputs: string[];
  tags: string[];
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InputHandlers {
  handleKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => void;
  handleChange: (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

function useInputManagement(
  inputs: string[],
  setInputs: React.Dispatch<React.SetStateAction<string[]>>,
  setFocusIndex: (index: number | null) => void,
): InputHandlers {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newInputs = [...inputs];
    const previousValue = inputs[index];
    const newValue = e.target.value;
    newInputs[index] = newValue;
    setInputs(newInputs);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentInput = inputs[index].trim();
      const nextInput = inputs[index + 1]?.trim();

      if (nextInput === "") return;
      if (currentInput === "") {
        setFocusIndex(null);
        (e.target as HTMLTextAreaElement).blur();
        return;
      }

      const newInputs = [...inputs];
      newInputs.splice(index + 1, 0, "");
      setInputs(newInputs);
      setFocusIndex(index + 1);
    }

    if (e.key === "Backspace" && inputs[index].trim() === "" && index !== 0) {
      e.preventDefault();
      const newInputs = [...inputs];
      newInputs.splice(index, 1);
      setInputs(newInputs);
      setFocusIndex(index - 1);
    }
  };

  return { handleKeyDown, handleChange };
}

export default function BlessingsFailuresBlock({
  title,
  placeholder,
  inputs,
  setInputs,
  tags,
  setTags,
  setIsTyping,
}: BlessingsFailuresBlockProps) {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const { handleKeyDown, handleChange } = useInputManagement(
    inputs,
    setInputs,
    setFocusIndex,
  );

  // Effect to handle focusing when focusIndex changes
  useEffect(() => {
    if (focusIndex !== null && textareaRefs.current[focusIndex]) {
      textareaRefs.current[focusIndex]?.focus();
      setFocusIndex(null); // Reset focus index after focusing
    }
  }, [focusIndex]);

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    setIsTyping(false);
  };

  return (
    <div className="mt-8" role="region" aria-label={title}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Inputs */}
      <ul className="flex flex-col gap-2 mt-4">
        {inputs.map((input, index) => (
          <li
            key={index}
            className="border-b-2 border-white/10 flex items-start"
          >
            <TextareaAutosize
              ref={(el) => {
                textareaRefs.current[index] = el;
              }}
              className="bg-transparent py-2 w-full text-xl text-wrap flex-1 focus:outline-none resize-none overflow-hidden"
              placeholder={placeholder}
              value={input}
              onChange={(e) => handleChange(index, e)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`${title} entry ${index + 1}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
