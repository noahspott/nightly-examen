import StepHeader from "@/components/examen/StepHeader";
import Quote from "@/components/examen/Quote";
import Timer from "@/components/examen/Timer";

const heading = "Meditate on the Presence of God";
const description = "Pause and remember that God is with you in this moment, surrounding you with His love and grace.";

const quote = "And surely I am with you always, to the very end of the age.";
const quoteAuthor = "Matthew 28:20";

export default function Step1() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <Quote>
        <p>"{quote}"</p>
        <br />
        <p>{quoteAuthor}</p>
      </Quote>
      <div className="flex mt-8 justify-center items-center">
        <Timer minutes={1} seconds={0} />
      </div>
    </div>
  );
}