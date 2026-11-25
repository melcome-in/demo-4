import React from 'react';
import { WeddingConfig } from '../../types/wedding';

interface OpeningBlueDoorHeroProps {
  config: WeddingConfig;
  isDoorOpened: boolean;
  isOpeningInProgress: boolean;
  onOpenDoor: () => void;
  onOpenCustomizer: () => void;
}

export const OpeningBlueDoorHero: React.FC<OpeningBlueDoorHeroProps> = () => {
  // First screen is 100% pure unobstructed Blue Door; touching the 3D Blue Door directly opens it.
  return null;
};
