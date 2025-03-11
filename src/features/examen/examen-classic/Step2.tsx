import {
  StepHeader,
  BlessingsFailuresBlock,
} from "@/features/examen/components";
import { ExamenStepProps } from "../types";

// Content
const heading = "Recognize God's Blessings";
const description =
  "Take a moment to reflect on the countless gifts God has given you today, both big and small, and thank Him for His goodness.";
const title = "Today's Blessings";
const blessingPlaceholderTesting = "Today...";
const blessingPlaceholder = "Today, the Lord has blessed me with...";

export default function Step2({
  blessings,
  setBlessings,
  blessingsTags,
  setBlessingsTags,
  setIsTyping,
}: ExamenStepProps) {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <BlessingsFailuresBlock
        title={title}
        inputs={blessings}
        setInputs={setBlessings}
        tags={blessingsTags}
        setTags={setBlessingsTags}
        placeholder={blessingPlaceholder}
        setIsTyping={setIsTyping}
      />
    </div>
  );
}
