import StepHeader from "@/components/examen/StepHeader";

const heading = "Recognize God's Blessings";
const description = "Take a moment to reflect on the countless gifts God has given you today, both big and small, and thank Him for His goodness.";

export default function Step2() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
    </div>
  );
}