import React, { useState, useCallback } from "react";
import { StageData, ScoreData } from "../types/game";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import StageThree from "./StageThree";
import StageFour from "./StageFour";
import StageFive from "./StageFive";
import ScoreBoard from "./ScoreBoard";
import {
  calculateAccuracy,
  calculateTotalErrors,
  calculateTotalScore,
} from "../lib/gameUtils";
import { toast } from "@/components/ui/use-toast";

interface GameStageProps {
  stageData: StageData;
  onComplete: (scoreData: ScoreData) => void;
  currentStage: number;
  totalStages: number;
  score: number;
}

const GameStage: React.FC<GameStageProps> = ({
  stageData,
  onComplete,
  currentStage,
  totalStages,
  score,
}) => {
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleStageComplete = useCallback(
    (userInputs: Record<string, string>) => {
      setIsActive(false);
      
      // Calculate accuracy and errors
      const stageAccuracy = calculateAccuracy(userInputs, stageData.expectedInputs);
      setAccuracy(stageAccuracy);
      
      // Calculate errors
      let errorCount = 0;
      Object.keys(stageData.expectedInputs).forEach((key) => {
        if (userInputs[key] !== stageData.expectedInputs[key]) {
          errorCount++;
        }
      });
      setErrors(errorCount);
      
      // Calculate stage score
      let stageScore = 0;
      Object.keys(stageData.expectedInputs).forEach((key) => {
        if (userInputs[key] === stageData.expectedInputs[key]) {
          stageScore += stageData.pointsPerCorrect;
        } else if (userInputs[key]) {
          stageScore -= stageData.penaltyPerError;
        }
      });
      
      // Ensure score doesn't go below zero for this stage
      stageScore = Math.max(0, stageScore);
      
      // Create score data
      const scoreData: ScoreData = {
        stage: currentStage,
        score: stageScore,
        accuracy: stageAccuracy,
        errors: errorCount,
      };
      
      // Show result toast
      toast({
        title: `Stage ${currentStage} Complete!`,
        description: `Score: ${stageScore} | Accuracy: ${stageAccuracy}%`,
        variant: "default",
      });
      
      // Give the user a moment to see their score
      setTimeout(() => {
        onComplete(scoreData);
      }, 1500);
    },
    [stageData, currentStage, onComplete]
  );

  // Render the appropriate stage component
  const renderStage = () => {
    const props = {
      stageData,
      onComplete: handleStageComplete,
    };

    switch (currentStage) {
      case 1:
        return <StageThree {...props} />;
      case 2:
        return <StageFour {...props} />;
      case 3:
        return <StageFive {...props} />;
      default:
        return <StageThree {...props} />;
    }
  };

  return (
    <div className="game-container">
      <ScoreBoard
        score={score}
        accuracy={accuracy}
        errors={errors}
        currentStage={currentStage}
        totalStages={totalStages}
      />
      {renderStage()}
    </div>
  );
};

export default GameStage;
