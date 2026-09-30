/**
 * محقق الحارة (The Neighborhood Detective)
 * Slogan: كل دليل له حكاية.
 * Case 01: الغرفة المقفولة
 */

import React, { useState, useEffect } from 'react';
import { GameSaveState, INITIAL_GAME_STATE, ScreenMode, EndingType } from './game/gameState';
import { SaveSystem } from './game/saveSystem';
import { soundManager } from './game/soundSystem';
import { LOCATIONS, Hotspot } from './data/locations';
import { EVIDENCE_ITEMS } from './data/evidence';
import { DialogueChoice } from './data/dialogues';

import { TopNav } from './components/TopNav';
import { IntroScreen } from './components/IntroScreen';
import { MapView } from './components/MapView';
import { LocationScene } from './components/LocationScene';
import { DialogueModal } from './components/DialogueModal';
import { NotebookModal } from './components/NotebookModal';
import { DeductionBoard } from './components/DeductionBoard';
import { ForensicLabModal } from './components/puzzles/ForensicLabModal';
import { CassettePuzzleModal } from './components/puzzles/CassettePuzzleModal';
import { AccusationModal } from './components/AccusationModal';
import { ResultView } from './components/ResultView';

export default function App() {
  // Load saved state from LocalStorage or initialize
  const [gameState, setGameState] = useState<GameSaveState>(() => {
    const loaded = SaveSystem.load();
    return loaded || INITIAL_GAME_STATE;
  });

  const [hasSaveOnDisk, setHasSaveOnDisk] = useState<boolean>(() => SaveSystem.hasSave());

  // Auto-save whenever game state changes
  useEffect(() => {
    SaveSystem.save(gameState);
    setHasSaveOnDisk(true);
  }, [gameState]);

  // Global click to notify sound system for user gesture activation
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.notifyUserInteraction();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleNavigate = (screen: ScreenMode) => {
    setGameState(prev => ({
      ...prev,
      currentScreen: screen
    }));
  };

  const handleStartNewGame = () => {
    const freshState: GameSaveState = {
      ...INITIAL_GAME_STATE,
      currentScreen: 'map',
      gameStartedAt: Date.now(),
      lastSavedAt: Date.now()
    };
    setGameState(freshState);
  };

  const handleContinueGame = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: prev.currentScreen === 'intro' ? 'map' : prev.currentScreen
    }));
  };

  const handleResetGame = () => {
    const freshState = SaveSystem.reset();
    setGameState({
      ...freshState,
      currentScreen: 'intro'
    });
    setHasSaveOnDisk(false);
  };

  const handleSelectLocation = (locId: string) => {
    setGameState(prev => {
      const visited = prev.visitedLocationIds.includes(locId)
        ? prev.visitedLocationIds
        : [...prev.visitedLocationIds, locId];

      return {
        ...prev,
        currentLocationId: locId,
        visitedLocationIds: visited,
        currentScreen: 'location'
      };
    });
  };

  const handleInspectHotspot = (hotspot: Hotspot) => {
    setGameState(prev => {
      const inspected = prev.inspectedHotspotIds.includes(hotspot.id)
        ? prev.inspectedHotspotIds
        : [...prev.inspectedHotspotIds, hotspot.id];

      let newEvidence = [...prev.collectedEvidenceIds];
      if (hotspot.revealsEvidenceId && !newEvidence.includes(hotspot.revealsEvidenceId)) {
        newEvidence.push(hotspot.revealsEvidenceId);
      }

      return {
        ...prev,
        inspectedHotspotIds: inspected,
        collectedEvidenceIds: newEvidence
      };
    });
  };

  const handleTalkToCharacter = (charId: string) => {
    setGameState(prev => ({
      ...prev,
      activeCharacterId: charId,
      currentScreen: 'dialogue'
    }));
  };

  const handleDialogueChoice = (choice: DialogueChoice, nextNodeId: string) => {
    setGameState(prev => {
      const activeCharId = prev.activeCharacterId || 'char-salma';
      const prevCharHistory = prev.dialogueHistory[activeCharId] || [];
      const updatedCharHistory = [...prevCharHistory, nextNodeId];

      // Trust adjustment
      const currentTrust = prev.characterTrust[activeCharId] ?? 50;
      const updatedTrust = Math.max(0, Math.min(100, currentTrust + (choice.trustImpact || 0)));

      // Suspicion adjustment
      const currentSuspicion = prev.characterSuspicion[activeCharId] ?? 30;
      const updatedSuspicion = Math.max(0, Math.min(100, currentSuspicion + (choice.suspicionImpact || 0)));

      // Knowledge flags
      const flags = choice.setsFlag && !prev.knowledgeFlags.includes(choice.setsFlag)
        ? [...prev.knowledgeFlags, choice.setsFlag]
        : prev.knowledgeFlags;

      // Unlocked evidence
      let newEvidence = [...prev.collectedEvidenceIds];
      if (choice.unlocksEvidenceId && !newEvidence.includes(choice.unlocksEvidenceId)) {
        newEvidence.push(choice.unlocksEvidenceId);
      }

      return {
        ...prev,
        dialogueHistory: {
          ...prev.dialogueHistory,
          [activeCharId]: updatedCharHistory
        },
        characterTrust: {
          ...prev.characterTrust,
          [activeCharId]: updatedTrust
        },
        characterSuspicion: {
          ...prev.characterSuspicion,
          [activeCharId]: updatedSuspicion
        },
        knowledgeFlags: flags,
        collectedEvidenceIds: newEvidence
      };
    });
  };

  const handleEvidencePresented = (evidenceId: string) => {
    // Registered presentation
  };

  const handlePuzzleSolved = (puzzleId: string, evidenceId: string) => {
    setGameState(prev => {
      const puzzles = prev.completedPuzzleIds.includes(puzzleId)
        ? prev.completedPuzzleIds
        : [...prev.completedPuzzleIds, puzzleId];

      const evidence = prev.collectedEvidenceIds.includes(evidenceId)
        ? prev.collectedEvidenceIds
        : [...prev.collectedEvidenceIds, evidenceId];

      return {
        ...prev,
        completedPuzzleIds: puzzles,
        collectedEvidenceIds: evidence
      };
    });
  };

  const handleUpdateCharacterTrustSuspicion = (charId: string, trustDelta: number, suspicionDelta: number) => {
    setGameState(prev => {
      const curTrust = prev.characterTrust[charId] ?? 50;
      const curSuspicion = prev.characterSuspicion[charId] ?? 30;
      return {
        ...prev,
        characterTrust: {
          ...prev.characterTrust,
          [charId]: Math.max(0, Math.min(100, curTrust + trustDelta))
        },
        characterSuspicion: {
          ...prev.characterSuspicion,
          [charId]: Math.max(0, Math.min(100, curSuspicion + suspicionDelta))
        }
      };
    });
  };

  const handleUpdateDeductionConnections = (connections: {
    culpritHypothesisId?: string;
    methodHypothesisId?: string;
    motiveHypothesisId?: string;
    deedHypothesisId?: string;
    selectedEvidenceIds: string[];
  }) => {
    setGameState(prev => ({
      ...prev,
      deductionConnections: connections
    }));
  };

  const handleUpdateTimelineAssignments = (assignments: Record<string, string>) => {
    setGameState(prev => ({
      ...prev,
      timelineAssignments: assignments
    }));
  };

  const handleSubmitAccusation = (ending: EndingType) => {
    setGameState(prev => ({
      ...prev,
      finalEnding: ending,
      currentScreen: 'result'
    }));
  };

  const currentLocation = LOCATIONS.find(l => l.id === gameState.currentLocationId) || LOCATIONS[0];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0e0c0a] text-[#ebdcc6] font-sans antialiased selection:bg-[#c9832b] selection:text-white flex flex-col">
      
      {/* Top Persistent Header Bar */}
      <TopNav
        gameState={gameState}
        onNavigate={handleNavigate}
        onResetGame={handleResetGame}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-10">
        
        {/* Screen 1: Cinematic Intro */}
        {gameState.currentScreen === 'intro' && (
          <IntroScreen
            hasExistingSave={hasSaveOnDisk && gameState.visitedLocationIds.length > 1}
            onStartNew={handleStartNewGame}
            onContinue={handleContinueGame}
            onReset={handleResetGame}
          />
        )}

        {/* Screen 2: Interactive Neighborhood Map */}
        {gameState.currentScreen === 'map' && (
          <MapView
            gameState={gameState}
            onSelectLocation={handleSelectLocation}
          />
        )}

        {/* Screen 3: Location Scene & Crime Scene Hotspots */}
        {gameState.currentScreen === 'location' && (
          <LocationScene
            location={currentLocation}
            gameState={gameState}
            onBackToMap={() => handleNavigate('map')}
            onInspectHotspot={handleInspectHotspot}
            onTalkToCharacter={handleTalkToCharacter}
            onNavigate={handleNavigate}
          />
        )}

        {/* Screen 4: Branching Witness Dialogue */}
        {gameState.currentScreen === 'dialogue' && gameState.activeCharacterId && (
          <DialogueModal
            characterId={gameState.activeCharacterId}
            gameState={gameState}
            onClose={() => handleNavigate('location')}
            onChoiceSelected={handleDialogueChoice}
            onEvidencePresented={handleEvidencePresented}
            onUpdateCharacterTrustSuspicion={handleUpdateCharacterTrustSuspicion}
          />
        )}

        {/* Screen 5: Detective Notebook */}
        {gameState.currentScreen === 'notebook' && (
          <NotebookModal
            gameState={gameState}
            onClose={() => handleNavigate(gameState.visitedLocationIds.length > 0 ? 'location' : 'map')}
          />
        )}

        {/* Screen 6: Deduction Board & Timeline */}
        {gameState.currentScreen === 'deduction-board' && (
          <DeductionBoard
            gameState={gameState}
            onUpdateConnections={handleUpdateDeductionConnections}
            onUpdateTimeline={handleUpdateTimelineAssignments}
            onNavigate={handleNavigate}
          />
        )}

        {/* Screen 7: Puzzle 1 - Forensic Indentation Analysis */}
        {gameState.currentScreen === 'puzzle-forensic' && (
          <ForensicLabModal
            isAlreadySolved={gameState.completedPuzzleIds.includes('puzzle-forensic')}
            onPuzzleSolved={(evId) => handlePuzzleSolved('puzzle-forensic', evId)}
            onClose={() => handleNavigate('location')}
          />
        )}

        {/* Screen 8: Puzzle 2 - Cassette Audio Analysis */}
        {gameState.currentScreen === 'puzzle-cassette' && (
          <CassettePuzzleModal
            isAlreadySolved={gameState.completedPuzzleIds.includes('puzzle-cassette')}
            onPuzzleSolved={(evId) => handlePuzzleSolved('puzzle-cassette', evId)}
            onClose={() => handleNavigate('location')}
          />
        )}

        {/* Screen 9: Final Accusation */}
        {gameState.currentScreen === 'accusation' && (
          <AccusationModal
            gameState={gameState}
            onCancel={() => handleNavigate('deduction-board')}
            onSubmitAccusation={handleSubmitAccusation}
          />
        )}

        {/* Screen 10: Case Resolution & Endings */}
        {gameState.currentScreen === 'result' && gameState.finalEnding && (
          <ResultView
            ending={gameState.finalEnding}
            gameState={gameState}
            onRestartNewGame={handleStartNewGame}
            onReviewNotebook={() => handleNavigate('notebook')}
          />
        )}

      </main>

      {/* Persistent Subtle Egyptian Noir Footer */}
      <footer className="bg-[#0a0807] border-t border-[#201914] py-3 px-4 text-center text-xs text-[#736353]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif-arabic font-bold text-[#c9832b]">محقق الحارة</span>
            <span>—</span>
            <span>كل دليل له حكاية.</span>
          </div>
          <div className="text-[11px] text-[#5e5043]">
            حفظ تلقائي نشط في المتصفح · القضية 01: الغرفة المقفولة
          </div>
        </div>
      </footer>

    </div>
  );
}
