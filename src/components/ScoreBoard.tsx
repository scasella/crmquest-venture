
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Target, AlertTriangle } from "lucide-react";

interface ScoreBoardProps {
  score: number;
  accuracy: number;
  errors: number;
  currentStage: number;
  totalStages: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  accuracy,
  errors,
  currentStage,
  totalStages,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-white/90 backdrop-blur shadow-md p-4 border-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
            <span className="text-sm text-gray-500 mb-1">Stage</span>
            <div className="text-xl font-semibold text-gray-900">
              {currentStage}/{totalStages}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
            <span className="text-sm text-gray-500 mb-1">Score</span>
            <div className="text-xl font-semibold text-gray-900">{score}</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
            <span className="text-sm text-gray-500 mb-1 flex items-center">
              <Target className="w-3 h-3 mr-1" /> Accuracy
            </span>
            <div className="text-xl font-semibold text-gray-900">{accuracy}%</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-sm text-gray-500 mb-1 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" /> Errors
            </span>
            <div className="text-xl font-semibold text-gray-900">{errors}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ScoreBoard;
