
import React, { useState, useEffect, useCallback } from "react";
import { StageData, ScoreData } from "../types/game";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import StageThree from "./StageThree";
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
  const [timeRemaining, setTimeRemaining] = useState(stageData.timeLimit);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      // Time's up
      setIsActive(false);
      
      toast({
        title: "Time's up!",
        description: "You didn't complete the stage in time",
        variant: "destructive",
      });
      
      // Auto-submit with current values after a short delay
      setTimeout(() => {
        const scoreData: ScoreData = {
          stage: currentStage,
          score: 0, // No points for timeout
          accuracy,
          timeRemaining: 0,
          errors,
        };
        
        onComplete(scoreData);
      }, 2000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [timeRemaining, isActive, onComplete, currentStage, accuracy, errors]);

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
      
      // Add time bonus
      const timeBonus = Math.floor(timeRemaining / 5);
      stageScore += timeBonus;
      
      // Create score data
      const scoreData: ScoreData = {
        stage: currentStage,
        score: stageScore,
        accuracy: stageAccuracy,
        timeRemaining,
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
    [stageData, timeRemaining, currentStage, onComplete]
  );

  // Render the appropriate stage component
  const renderStage = () => {
    const props = {
      stageData,
      onComplete: handleStageComplete,
      timeRemaining,
    };

    switch (currentStage) {
      case 1:
        return <StageOne {...props} />;
      case 2:
        return <StageTwo {...props} />;
      case 3:
        return <StageThree {...props} />;
      default:
        return <StageOne {...props} />;
    }
  };

  return (
    <div className="game-container">
      <ScoreBoard
        score={score}
        timeRemaining={timeRemaining}
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
