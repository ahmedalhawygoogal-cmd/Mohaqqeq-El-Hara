/**
 * LocalStorage Save System for "محقق الحارة"
 */

import { GameSaveState, INITIAL_GAME_STATE } from './gameState';

const SAVE_KEY = 'muhaqqiq_alhara_save_v1';

export class SaveSystem {
  static load(): GameSaveState | null {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      if (!serialized) return null;
      const parsed = JSON.parse(serialized);
      if (parsed && parsed.caseId) {
        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          lastSavedAt: Date.now()
        };
      }
    } catch (e) {
      console.error('Failed to load save state from LocalStorage:', e);
    }
    return null;
  }

  static save(state: GameSaveState): void {
    try {
      const stateToSave = {
        ...state,
        lastSavedAt: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to write save state to LocalStorage:', e);
    }
  }

  static hasSave(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  static reset(): GameSaveState {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear LocalStorage:', e);
    }
    return {
      ...INITIAL_GAME_STATE,
      gameStartedAt: Date.now(),
      lastSavedAt: Date.now()
    };
  }
}
