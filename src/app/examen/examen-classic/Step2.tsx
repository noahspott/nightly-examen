import StepHeader from "@/components/examen/StepHeader";
import BlessingsFailuresBlock from "@/components/examen/BlessingsFailuresBlock";
import { ExamenStepProps } from '../types';

const heading = "Recognize God's Blessings";
const description = "Take a moment to reflect on the countless gifts God has given you today, both big and small, and thank Him for His goodness.";

const title = "Today's Blessings";

export default function Step2({ blessings, setBlessings, blessingsTags, setBlessingsTags }: ExamenStepProps) {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <BlessingsFailuresBlock 
        title={title}
        inputs={blessings}
        setInputs={setBlessings}
        tags={blessingsTags}
        setTags={setBlessingsTags}
        firstInputPlaceholder="Enter your blessing here..."
      />
    </div>
  );
}