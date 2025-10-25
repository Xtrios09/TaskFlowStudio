import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Achievement } from '@shared/schema';
import { toast } from '@/hooks/use-toast';
import { Trophy, Star, Medal, Zap, Target, TrendingUp } from 'lucide-react';

interface AchievementContextType {
  unlockAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt' | 'userId'>) => void;
  achievements: Achievement[];
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  zap: Zap,
  target: Target,
  fire: TrendingUp,
};

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const unlockAchievement = useCallback((achievement: Omit<Achievement, 'id' | 'unlockedAt' | 'userId'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: crypto.randomUUID(),
      userId: 'default_user',
      unlockedAt: new Date(),
    };
    
    setAchievements(prev => [...prev, newAchievement]);
    
    const Icon = iconMap[achievement.icon] || Trophy;
    
    toast({
      title: (
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold">{achievement.title}</span>
        </div>
      ),
      description: achievement.description,
      className: "border-primary/30 bg-card/95 backdrop-blur-xl",
    });
  }, []);

  return (
    <AchievementContext.Provider value={{ unlockAchievement, achievements }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
