import StepHeader from "@/components/examen/StepHeader";
import Timer from "@/components/examen/Timer";

const heading = "Rest in God's Peace";
const description = "Rest in the assurance of God's love. Reflect on the promise of renewal and the blessings that await you tomorrow. Let His grace fill you with hope and joy as you prepare for a new day.";

export default function Step7() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <div className="flex mt-8 justify-center items-center">
        <Timer minutes={1} seconds={0} />
      </div>
    </div>
  );
}