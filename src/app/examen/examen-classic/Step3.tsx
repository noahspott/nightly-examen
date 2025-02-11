import StepHeader from "@/components/examen/StepHeader";
import Quote from "@/components/examen/Quote";

const heading = "Prayer of Gratitude";
const description = "Reflect on the blessings you recorded today and give thanks to God for His abundant love and provision.";

const prayer = "Heavenly Father, I thank You for the countless gifts You have bestowed upon me today—from the simple blessing of a breath to the beauty of the sunrise that fills my heart with hope. Your grace is evident in every kind word, every moment of peace, and every act of love. May I never take these gifts for granted, but always remember Your loving presence in my life. Amen."

export default function Step3() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      <Quote>
        <p>{prayer}</p>
      </Quote>
    </div>
  );
}
