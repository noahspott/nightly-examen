import {
  StepHeader,
  BlessingsFailuresBlock,
} from "@/features/examen/components";
import { ExamenStepProps } from "../types";

const heading = "Recognize Your Shortcomings";
const description =
  "Reflect honestly on the moments you fell short today, acknowledging where you failed to embrace God's grace.";

export default function Step4({
  failures,
  setFailures,
  failuresTags,
  setFailuresTags,
  setIsTyping,
}: ExamenStepProps) {
  return (
    <>
      <StepHeader heading={heading} description={description} />
      <BlessingsFailuresBlock
        title="Today's Shortcomings"
        inputs={failures}
        setInputs={setFailures}
        tags={failuresTags}
        setTags={setFailuresTags}
        placeholder="Today I failed to..."
        setIsTyping={setIsTyping}
      />
    </>
  );
}
