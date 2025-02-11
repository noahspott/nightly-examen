import StepHeader from "@/components/examen/StepHeader";
import Quote from "@/components/examen/Quote";

const heading = "Prayer for Forgiveness";
const description = "Contemplate the shortcomings you have acknowledged today, and ask for God's mercy to guide you toward renewal.";

const prayer = "Merciful Lord, I come before You with a humble heart, acknowledging the times I have fallen short and failed to embrace Your grace. Please forgive my shortcomings and help me to learn from my mistakes. Cleanse my heart and renew my spirit, so that I may walk in Your light with greater faith and love tomorrow. Amen."

export default function Step5() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <Quote>
        <p>{prayer}</p>
      </Quote>
    </div>
  );
}
