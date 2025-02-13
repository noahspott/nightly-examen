import StepHeader from "@/components/examen/StepHeader";

const heading = "Resolve and Seek God's Help";
const description = "Commit to turning away from the sins and shortcomings of yesterday. Write down your resolve for the coming day and ask the Lord to grant you the strength and grace to overcome your weaknesses.";
const resolvePlaceholder = "Today, I resolve to...";

export default function Step6() {
  return (
    <div>
      <StepHeader heading={heading} description={description} />
      
      <div className="h-full">
        <h3 className="text-2xl mt-8 font-bold">Today's Resolve</h3>
        <textarea 
          className="mt-4 text-xl size-full text-wrap overflow-hidden resize-none bg-transparent focus:outline-none rounded-md" 
          placeholder={resolvePlaceholder} 
          onChange={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
        />
      </div>
    </div>
  );
}