export interface ExamenStepProps {
  blessings: string[];
  setBlessings: React.Dispatch<React.SetStateAction<string[]>>;
  failures: string[];
  setFailures: React.Dispatch<React.SetStateAction<string[]>>;
  blessingsTags: string[];
  setBlessingsTags: React.Dispatch<React.SetStateAction<string[]>>;
  failuresTags: string[];
  setFailuresTags: React.Dispatch<React.SetStateAction<string[]>>;
} 