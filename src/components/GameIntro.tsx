
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, ChevronRight, Award, Target } from "lucide-react";

interface GameIntroProps {
  onStart: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="container max-w-3xl mx-auto px-4 py-12"
    >
      <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-20 h-20 bg-game-blue/10 rounded-full flex items-center justify-center mb-2"
          >
            <Database className="w-10 h-10 text-game-blue" />
          </motion.div>
          
          <CardTitle className="text-3xl font-bold text-gray-800">CRM Master Challenge</CardTitle>
          <p className="text-gray-500 max-w-lg mx-auto">
            Test your data entry skills in this multi-stage CRM challenge. Complete tasks accurately and quickly to earn the highest score.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-2">
                  <Target className="w-4 h-4 text-game-blue" />
                </div>
                <h3 className="font-medium text-gray-800">Precision</h3>
              </div>
              <p className="text-sm text-gray-600">
                Enter data with perfect accuracy to maximize your score. Each error costs points!
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-game-success/20 flex items-center justify-center mr-2">
                  <Clock className="w-4 h-4 text-game-success" />
                </div>
                <h3 className="font-medium text-gray-800">Speed</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete each stage before the timer runs out. Faster completion means higher scores.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-800">Adaptability</h3>
              </div>
              <p className="text-sm text-gray-600">
                Each stage presents a different CRM interface challenge. Adapt quickly to new layouts.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <h3 className="font-medium text-gray-800 mb-2">How to Play:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-game-blue mr-2">•</span>
                <span>Read the data carefully from the reference panel</span>
              </li>
              <li className="flex items-start">
                <span className="text-game-blue mr-2">•</span>
                <span>Enter the data correctly in the CRM form fields</span>
              </li>
              <li className="flex items-start">
                <span className="text-game-blue mr-2">•</span>
                <span>Submit before the timer runs out to proceed to the next stage</span>
              </li>
              <li className="flex items-start">
                <span className="text-game-blue mr-2">•</span>
                <span>Three stages of increasing complexity await you</span>
              </li>
            </ul>
          </motion.div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button 
              onClick={onStart}
              className="px-8 py-6 text-lg bg-game-blue hover:bg-game-blue/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
            >
              Start Challenge
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GameIntro;
