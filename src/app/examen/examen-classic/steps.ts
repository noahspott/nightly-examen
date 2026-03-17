import React from "react";
import * as Steps from "./index";
import type { ExamenStepProps } from "../types";

export const examenSteps: React.ComponentType<ExamenStepProps>[] = [
  Steps.Step1,
  Steps.Step2,
  Steps.Step3,
  Steps.Step4,
  Steps.Step5,
  Steps.Step6,
  Steps.Step7,
];