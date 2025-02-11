import StepHeader from "@/components/examen/StepHeader";

const heading = "Resolve and Seek God's Help";
const description = "Commit to turning away from the sins and shortcomings of yesterday. Write down your resolve for the coming day and ask the Lord to grant you the strength and grace to overcome your weaknesses.";

export default function Step6() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
    </div>
  );
}