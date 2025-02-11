type StepHeaderProps = {
  heading: string;
  description: string;
}

export default function StepHeader({heading, description}: StepHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{heading}</h1>
      <p className="text-base">{description}</p>
    </div>
  )
}