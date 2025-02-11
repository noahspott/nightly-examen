import StepHeader from "@/components/examen/StepHeader";

const heading = "Recognize Your Shortcomings";
const description = "Reflect honestly on the moments you fell short today, acknowledging where you failed to embrace God's grace.";

export default function Step4() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
    </div>
  );
}