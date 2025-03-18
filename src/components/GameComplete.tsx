
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreData } from "@/types/game";
import { Award, BarChart2, Clock, Target, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

interface GameCompleteProps {
  scores: ScoreData[];
  totalScore: number;
  totalAccuracy: number;
  totalTime: number;
  onRestart: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({ 
  scores, 
  totalScore, 
  totalAccuracy, 
  totalTime,
  onRestart 
}) => {
  // Determine performance rating
  const getRating = () => {
    if (totalAccuracy >= 90 && totalScore >= 100) return "Master";
    if (totalAccuracy >= 80 && totalScore >= 80) return "Expert";
    if (totalAccuracy >= 70 && totalScore >= 60) return "Proficient";
    if (totalAccuracy >= 60 && totalScore >= 40) return "Apprentice";
    return "Beginner";
  };
  
  const getRatingColor = () => {
    const rating = getRating();
    switch (rating) {
      case "Master": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Expert": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Proficient": return "bg-green-100 text-green-800 border-green-200";
      case "Apprentice": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="container max-w-3xl mx-auto px-4 py-12"
    >
      <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="text-center space-y-3 pb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-24 h-24 flex items-center justify-center mb-2"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-lg opacity-20 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold text-gray-800">Challenge Complete!</CardTitle>
            <p className="text-gray-500">You've completed all stages of the CRM Master Challenge</p>
          </div>
          
          <Badge className={`font-medium text-sm px-3 py-1 ${getRatingColor()}`}>
            {getRating()} CRM User
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
              <BarChart2 className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-sm text-gray-500">Total Score</span>
              <span className="text-2xl font-bold text-gray-800">{totalScore}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
              <Target className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-sm text-gray-500">Accuracy</span>
              <span className="text-2xl font-bold text-gray-800">{totalAccuracy}%</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Total Time</span>
              <span className="text-2xl font-bold text-gray-800">{formatTime(totalTime)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
              <AlertTriangle className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-sm text-gray-500">Total Errors</span>
              <span className="text-2xl font-bold text-gray-800">
                {scores.reduce((total, score) => total + score.errors, 0)}
              </span>
            </div>
          </motion.div>
          
          {/* Stage Breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="font-medium text-gray-700 mb-3">Stage Performance</h3>
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-medium text-gray-700">Stage {score.stage}</span>
                    <Badge variant="outline" className="bg-white">
                      Score: {score.score}
                    </Badge>
                  </div>
                  
                  <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <Target className="h-3.5 w-3.5 mr-1 text-green-500" />
                        Accuracy
                      </span>
                      <span className="font-medium text-gray-800">{score.accuracy}%</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        Time Left
                      </span>
                      <span className="font-medium text-gray-800">{score.timeRemaining}s</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1 text-red-500" />
                        Errors
                      </span>
                      <span className="font-medium text-gray-800">{score.errors}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Achievement Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
          >
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <Award className="h-4 w-4 text-blue-500 mr-1.5" />
              Achievements
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {totalAccuracy >= 90 && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Perfect Precision
                </Badge>
              )}
              
              {scores.some(score => score.timeRemaining > 30) && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Speed Demon
                </Badge>
              )}
              
              {scores.reduce((total, score) => total + score.errors, 0) === 0 && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Flawless Entry
                </Badge>
              )}
              
              {totalScore >= 100 && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  High Scorer
                </Badge>
              )}
              
              <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                Challenge Completed
              </Badge>
            </div>
          </motion.div>
        </CardContent>
        
        <CardFooter className="flex justify-center space-x-4 pb-6 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button 
              onClick={onRestart}
              className="px-6 py-2 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Button 
              className="px-6 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Share Results
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GameComplete;
