import StepHeader from "@/components/examen/StepHeader";
import BlessingsFailuresBlock from "@/components/examen/BlessingsFailuresBlock";
import { ExamenStepProps } from '../types';

const heading = "Recognize Your Shortcomings";
const description = "Reflect honestly on the moments you fell short today, acknowledging where you failed to embrace God's grace.";

export default function Step4({ failures, setFailures, failuresTags, setFailuresTags }: ExamenStepProps) {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <BlessingsFailuresBlock 
        title="Today's Shortcomings"
        inputs={failures}
        setInputs={setFailures}
        tags={failuresTags}
        setTags={setFailuresTags}
        firstInputPlaceholder="Enter your shortcomings here..."
      />
    </div>
  );
}