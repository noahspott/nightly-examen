
interface InputBulletProps {
  input: string;
  setInput: (input: string) => void;
  index: number;
  setFocusIndex: (index: number | null) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  placeholder: string;
  ref: React.RefObject<HTMLTextAreaElement>;
  setInputs: (inputs: string[]) => void;
  inputs: string[];
}
export default function InputBullet({ input, setInput, index, setFocusIndex, handleFocus, handleBlur, placeholder, ref, setInputs, inputs }: InputBulletProps) {
  return (
    <textarea
      ref={ref}
      className="bg-transparent py-2 w-full text-xl text-wrap flex-1 focus:outline-none resize-none h-11 min-h-11 overflow-hidden"
      placeholder={placeholder}
      value={input}
      onChange={(e) => {
        const newInputs = [...inputs];
        newInputs[index] = e.target.value;
        setInputs(newInputs);
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          // If the following input exists, but is empty, don't add a new input
          if (inputs[index + 1] && inputs[index + 1].trim() === '') {
            return;
          }

          // if the string is empty, consider the user is done typing
          if (input.trim() === '') {
            setFocusIndex(null);

            // Close the keyboard on mobile
            (e.target as HTMLTextAreaElement).blur();
            return;
          }

          // Insert new empty input after current
          const newInputs = [...inputs];
          newInputs.splice(index + 1, 0, '');
          setInputs(newInputs);
          setFocusIndex(index + 1);
        }
        if (e.key === 'Backspace' && input.trim() === '' && index !== 0) {
          e.preventDefault();
          const newInputs = [...inputs];
          newInputs.splice(index, 1);
          setInputs(newInputs);
          setFocusIndex(index - 1);
        }
      }}
    />
  );
}