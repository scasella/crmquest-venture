import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameIntro from "@/components/GameIntro";
import GameStage from "@/components/GameStage";
import GameComplete from "@/components/GameComplete";
import { Button } from "@/components/ui/button";
import { GameState, ScoreData } from "@/types/game";
import { generateStages } from "@/lib/gameUtils";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 1,
    totalStages: 3,
    score: 0,
    isGameActive: false,
    gameStatus: "intro",
    errors: 0,
    accuracy: 0,
    stageData: [],
  });
  
  const [stageScores, setStageScores] = useState<ScoreData[]>([]);

  useEffect(() => {
    // Generate stages data
    const stages = generateStages();
    setGameState((prev) => ({
      ...prev,
      stageData: stages,
      totalStages: stages.length,
    }));
  }, []);

  const handleGameStart = () => {
    // Start the game
    setGameState((prev) => ({
      ...prev,
      isGameActive: true,
      gameStatus: "playing",
      currentStage: 1,
      score: 0,
      errors: 0,
      accuracy: 0,
    }));
    
    setStageScores([]);
    
    toast({
      title: "Game Started!",
      description: "Accurately place customer data into the correct CRM fields",
    });
  };

  const handleStageComplete = (scoreData: ScoreData) => {
    // Update scores
    setStageScores((prev) => [...prev, scoreData]);
    
    // Update game state
    const newStage = gameState.currentStage + 1;
    
    if (newStage <= gameState.totalStages) {
      // Move to next stage
      setGameState((prev) => {
        // Mark current stage as completed
        const updatedStageData = [...prev.stageData];
        updatedStageData[prev.currentStage - 1].completed = true;
        
        return {
          ...prev,
          currentStage: newStage,
          score: prev.score + scoreData.score,
          errors: prev.errors + scoreData.errors,
          accuracy: Math.round(
            (prev.accuracy * (prev.currentStage - 1) + scoreData.accuracy) / prev.currentStage
          ),
          stageData: updatedStageData,
        };
      });
    } else {
      // Game complete
      setGameState((prev) => {
        // Mark final stage as completed
        const updatedStageData = [...prev.stageData];
        updatedStageData[prev.currentStage - 1].completed = true;
        
        return {
          ...prev,
          isGameActive: false,
          gameStatus: "completed",
          score: prev.score + scoreData.score,
          errors: prev.errors + scoreData.errors,
          accuracy: Math.round(
            (prev.accuracy * (prev.currentStage - 1) + scoreData.accuracy) / prev.currentStage
          ),
          stageData: updatedStageData,
        };
      });
      
      toast({
        title: "Game Complete!",
        description: "You've completed all stages of the CRM challenge!",
      });
    }
  };

  const handleRestart = () => {
    // Reset game state and return to intro
    setGameState((prev) => ({
      ...prev,
      currentStage: 1,
      score: 0,
      isGameActive: false,
      gameStatus: "intro",
      errors: 0,
      accuracy: 0,
      stageData: generateStages(),
    }));
    
    setStageScores([]);
  };

  const renderScreen = () => {
    switch (gameState.gameStatus) {
      case "intro":
        return <GameIntro onStart={handleGameStart} />;
        
      case "playing":
        return (
          <>
            <div className="container max-w-7xl mx-auto px-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
                    handleRestart();
                  }
                }}
                className="flex items-center text-gray-500 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quit Game
              </Button>
            </div>
            
            <GameStage
              stageData={gameState.stageData[gameState.currentStage - 1]}
              onComplete={handleStageComplete}
              currentStage={gameState.currentStage}
              totalStages={gameState.totalStages}
              score={gameState.score}
            />
          </>
        );
        
      case "completed":
        return (
          <GameComplete
            scores={stageScores}
            totalScore={gameState.score}
            totalAccuracy={gameState.accuracy}
            totalTime={0} // Since we removed time limits, we can set this to 0
            onRestart={handleRestart}
          />
        );
        
      default:
        return <GameIntro onStart={handleGameStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.gameStatus + gameState.currentStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
