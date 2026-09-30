/**
 * Centralized Asset Configuration
 * Audio and visual assets configuration with safe fallbacks.
 */

export interface AssetConfig {
  backgroundMusic: string;
  defaultVolume: number;
}

export const ASSETS: AssetConfig = {
  // Can be located at root or /audio/
  backgroundMusic: '/midnight_in_the_quarter.mp3',
  defaultVolume: 0.75, // 75% default volume for clear, audible audio
};
