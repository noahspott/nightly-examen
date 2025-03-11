type StepHeaderProps = {
  heading: string;
  description: string;
}

export default function StepHeader({heading, description}: StepHeaderProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{heading}</h1>
      <p className="text-xl">{description}</p>
    </div>
  )
}