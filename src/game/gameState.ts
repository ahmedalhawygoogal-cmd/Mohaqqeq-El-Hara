/**
 * Game State and Types for "محقق الحارة"
 */

export type ScreenMode =
  | 'intro'
  | 'map'
  | 'location'
  | 'dialogue'
  | 'notebook'
  | 'deduction-board'
  | 'puzzle-forensic'
  | 'puzzle-cassette'
  | 'puzzle-timeline'
  | 'accusation'
  | 'result';

export type EndingType =
  | 'full-truth'       // الحقيقة الكاملة
  | 'protected-truth'  // الحقيقة المحمية
  | 'alley-speaks'     // الحارة تتكلم
  | 'wrong-accusation' // اتهام خاطئ
  | 'fragile-deduction';// استنتاج هش بسبب نقص الأدلة

export interface GameSaveState {
  version: number;
  caseId: string;
  currentScreen: ScreenMode;
  currentLocationId: string;
  activeCharacterId?: string;
  visitedLocationIds: string[];
  collectedEvidenceIds: string[];
  inspectedHotspotIds: string[];
  completedDialogueIds: string[];
  dialogueHistory: Record<string, string[]>; // characterId -> list of nodeIds visited
  characterTrust: Record<string, number>;
  characterSuspicion: Record<string, number>;
  knowledgeFlags: string[];
  completedPuzzleIds: string[];
  // Timeline puzzle state
  timelineAssignments: Record<string, string>; // slotTime -> eventId
  // Deduction board links
  deductionConnections: {
    culpritHypothesisId?: string;
    methodHypothesisId?: string;
    motiveHypothesisId?: string;
    deedHypothesisId?: string;
    selectedEvidenceIds: string[];
  };
  finalEnding?: EndingType;
  gameStartedAt: number;
  lastSavedAt: number;
}

export const INITIAL_GAME_STATE: GameSaveState = {
  version: 1,
  caseId: 'case-01',
  currentScreen: 'intro',
  currentLocationId: 'loc-office',
  visitedLocationIds: ['loc-office'],
  collectedEvidenceIds: [],
  inspectedHotspotIds: [],
  completedDialogueIds: [],
  dialogueHistory: {},
  characterTrust: {
    'char-salma': 65,
    'char-fadi': 40,
    'char-huda': 85,
    'char-nono': 70,
    'char-aqqad': 25
  },
  characterSuspicion: {
    'char-salma': 30,
    'char-fadi': 55,
    'char-huda': 10,
    'char-nono': 15,
    'char-aqqad': 75
  },
  knowledgeFlags: [],
  completedPuzzleIds: [],
  timelineAssignments: {},
  deductionConnections: {
    selectedEvidenceIds: []
  },
  gameStartedAt: Date.now(),
  lastSavedAt: Date.now()
};
