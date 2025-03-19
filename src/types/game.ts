
export interface GameState {
  currentStage: number;
  totalStages: number;
  score: number;
  isGameActive: boolean;
  gameStatus: 'intro' | 'playing' | 'completed' | 'failed';
  errors: number;
  accuracy: number;
  stageData: StageData[];
}

export interface StageData {
  id: number;
  name: string;
  description: string;
  pointsPerCorrect: number;
  penaltyPerError: number;
  completed: boolean;
  fields: FormField[];
  userInputs: Record<string, string>;
  expectedInputs: Record<string, string>;
  unstructuredData: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'checkbox' | 'textarea';
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface ScoreData {
  stage: number;
  score: number;
  accuracy: number;
  errors: number;
  timeRemaining?: number; // Added as optional since we're removing time limits
}

