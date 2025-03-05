import { ExamenProvider } from "@/context/ExamenContext";
import ExamenUILayout from "./ExamenUILayout";

export default function ExamenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExamenProvider>
      <ExamenUILayout>{children}</ExamenUILayout>
    </ExamenProvider>
  );
}
