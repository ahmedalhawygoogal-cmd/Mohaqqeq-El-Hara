import React, { useState } from 'react';
import { LOCATIONS, LocationData } from '../data/locations';
import { CHARACTERS } from '../data/characters';
import { GameSaveState } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  Building2, 
  Home, 
  Coffee, 
  Wrench, 
  ShoppingBag, 
  Compass, 
  Lock, 
  Users, 
  Sparkles, 
  ArrowLeft,
  Search,
  Eye
} from 'lucide-react';

interface MapViewProps {
  gameState: GameSaveState;
  onSelectLocation: (locId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ gameState, onSelectLocation }) => {
  const [selectedPin, setSelectedPin] = useState<LocationData | null>(
    LOCATIONS.find(l => l.id === gameState.currentLocationId) || LOCATIONS[0]
  );
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'future'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  const getUninspectedCluesCount = (loc: LocationData) => {
    return loc.hotspots.filter(h => !gameState.inspectedHotspotIds.includes(h.id)).length;
  };

  const activeLocations = LOCATIONS.filter(l => l.type === 'active');
  const lockedLocations = LOCATIONS.filter(l => l.type === 'locked');
  const displayedLocations = filterMode === 'active' 
    ? activeLocations 
    : filterMode === 'future' 
      ? lockedLocations 
      : LOCATIONS;

  const handlePinClick = (loc: LocationData) => {
    soundManager.playSoundEffect('click');
    setSelectedPin(loc);
  };

  const handleEnterLocation = (locId: string) => {
    soundManager.playSoundEffect('paper');
    onSelectLocation(locId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right">
      
      {/* Header with Title and Filter Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#2e241c] pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-arabic font-bold text-[#e5a744]">
            خريطة حارة السرايا
          </h2>
          <p className="text-xs sm:text-sm text-[#a89682] mt-1">
            اختر الموقع المراد تفتيشه لمعاينة الآثار المادية واستجواب الشهود المتواجدين.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#1a1512] rounded-lg border border-[#33271e] self-start md:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterMode === 'all'
                ? 'bg-[#2e241d] text-[#e5a744] shadow-sm'
                : 'text-[#948372] hover:text-[#d6c5b2]'
            }`}
          >
            كافة أرجاء الحي ({LOCATIONS.length})
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterMode === 'active'
                ? 'bg-[#2e241d] text-[#e5a744] shadow-sm'
                : 'text-[#948372] hover:text-[#d6c5b2]'
            }`}
          >
            المواقع النشطة ({activeLocations.length})
          </button>
          <button
            onClick={() => setFilterMode('future')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterMode === 'future'
                ? 'bg-[#2e241d] text-[#e5a744] shadow-sm'
                : 'text-[#948372] hover:text-[#d6c5b2]'
            }`}
          >
            ملفات قادمة ({lockedLocations.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Map Visual Grid Canvas */}
        <div className="lg:col-span-8 bg-[#14100e] border border-[#382b20] rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden min-h-[440px] sm:min-h-[520px]">
          
          {/* Subtle cartographic grid and cobblestone ambient background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c9832b_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* River Water Outline (Nile Curve) */}
          <div className="absolute top-0 right-0 w-44 h-32 opacity-20 pointer-events-none border-b-2 border-l-2 border-dashed border-[#5a80a0] rounded-bl-[100px]" />
          <div className="absolute top-4 right-6 text-[10px] text-[#6a8da6] opacity-50 font-serif-arabic pointer-events-none">
            فرع النيل القديم — هويس السرايا
          </div>

          {/* Map Compass Rose */}
          <div className="absolute bottom-4 left-4 opacity-30 text-[#e5a744] pointer-events-none flex flex-col items-center">
            <Compass className="w-8 h-8 animate-spin-slow" />
            <span className="text-[9px] mt-0.5">شمال</span>
          </div>

          {/* Locations Map Pins */}
          <div className="relative w-full h-[380px] sm:h-[460px]">
            {displayedLocations.map((loc) => {
              const isActive = loc.type === 'active';
              const isSelected = selectedPin?.id === loc.id;
              const uninspectedCount = isActive ? getUninspectedCluesCount(loc) : 0;
              const isCurrent = gameState.currentLocationId === loc.id;

              return (
                <div
                  key={loc.id}
                  style={{
                    position: 'absolute',
                    top: `${loc.mapCoordinates.y}%`,
                    right: `${loc.mapCoordinates.x}%`,
                    transform: 'translate(50%, -50%)'
                  }}
                  className="z-20"
                >
                  <button
                    onClick={() => handlePinClick(loc)}
                    className={`group relative flex flex-col items-center transition-all ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {/* Pulsing Clue Ping */}
                    {isActive && uninspectedCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#e5a744] rounded-full animate-ping opacity-75" />
                    )}

                    {/* Pin Bubble */}
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                        isActive
                          ? isSelected
                            ? 'bg-[#c9832b] text-[#120f0d] border-[#fedb9c] ring-4 ring-[#c9832b]/30'
                            : isCurrent
                              ? 'bg-[#2b211a] text-[#e5a744] border-[#d4973b]'
                              : 'bg-[#1b1612] text-[#d6c5b2] border-[#4a392b] group-hover:border-[#d4973b]'
                          : 'bg-[#13100e] text-[#6b5d50] border-[#29221b] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isActive ? (
                        getIcon(loc.visualTheme.bannerIcon)
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    {/* Label Tag under Pin */}
                    <div className="mt-1.5 px-2 py-0.5 rounded bg-[#100d0b]/90 border border-[#30261e] shadow-md text-center whitespace-nowrap">
                      <span className={`text-[11px] font-bold block ${
                        isSelected ? 'text-[#e5a744]' : isActive ? 'text-[#e2d5c3]' : 'text-[#7a6b5d]'
                      }`}>
                        {loc.title}
                      </span>
                      {isActive && uninspectedCount > 0 && (
                        <span className="text-[9px] text-[#e5a744] block font-mono">
                          {uninspectedCount} أثر غير مفحوص
                        </span>
                      )}
                      {!isActive && (
                        <span className="text-[9px] text-[#85705d] block">
                          قريبًا
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-[#8c7865] flex items-center justify-between border-t border-[#2d221a] pt-3">
            <span>انقر فوق أي علامة في الخريطة لمعاينة ملف الموقع وسكانه</span>
            <span className="text-[#d4973b] font-medium font-serif-arabic">حارة السرايا العتيقة</span>
          </div>

        </div>

        {/* Selected Location Detail Card */}
        <div className="lg:col-span-4 bg-[#171310] border border-[#3b2d21] rounded-xl p-5 sm:p-6 shadow-xl text-right">
          {selectedPin ? (
            <div>
              
              <div className="flex items-center justify-between mb-3 border-b border-[#2d2219] pb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedPin.type === 'active' 
                    ? 'bg-[#3b2a1a] text-[#e5a744] border border-[#6b4c2b]' 
                    : 'bg-[#201b17] text-[#806f5f] border border-[#362c23]'
                }`}>
                  {selectedPin.type === 'active' ? 'موقع نشط للتحقيق' : 'قريبًا — قضية قادمة'}
                </span>

                <div className="p-2 rounded bg-[#201a15] text-[#d4973b]">
                  {selectedPin.type === 'active' 
                    ? getIcon(selectedPin.visualTheme.bannerIcon)
                    : <Lock className="w-5 h-5 text-[#806f5f]" />}
                </div>
              </div>

              <h3 className="text-xl font-serif-arabic font-bold text-[#e5a744]">
                {selectedPin.title}
              </h3>
              <p className="text-xs text-[#9d8975] mt-0.5 mb-3">
                {selectedPin.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#cebeab] leading-relaxed mb-4">
                {selectedPin.description}
              </p>

              {/* Characters Present in this location */}
              {selectedPin.type === 'active' && (
                <div className="mb-4 bg-[#110e0c] p-3 rounded border border-[#2b211a]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4973b] mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>الشخصيات المتواجدة هنا:</span>
                  </div>
                  {selectedPin.characterIds.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedPin.characterIds.map((charId) => {
                        const char = CHARACTERS.find(c => c.id === charId);
                        if (!char) return null;
                        return (
                          <div key={charId} className="flex items-center justify-between text-xs py-1 border-b border-[#221a14] last:border-0">
                            <span className="font-bold text-[#ebdcc6]">{char.name}</span>
                            <span className="text-[11px] text-[#9c8976]">{char.role}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-[#806e5d] italic">
                      لا يوجد أشخاص حالياً (مسرح خالي).
                    </span>
                  )}
                </div>
              )}

              {/* Hotspots preview */}
              {selectedPin.type === 'active' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-[#9d8975] mb-2">
                    <span className="font-bold text-[#c9832b]">بؤر المعاينة المتاحة:</span>
                    <span>{selectedPin.hotspots.length} بؤر</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[#b8a693]">
                    {selectedPin.hotspots.map((hs) => {
                      const isInspected = gameState.inspectedHotspotIds.includes(hs.id);
                      return (
                        <li key={hs.id} className="flex items-center justify-between py-1 px-2 rounded bg-[#1f1914]">
                          <span className={isInspected ? 'text-[#7e6e5f] line-through' : 'text-[#ded0be]'}>
                            {hs.name}
                          </span>
                          <span className={`text-[10px] font-bold ${isInspected ? 'text-[#5ca66d]' : 'text-[#e5a744]'}`}>
                            {isInspected ? 'تم الفحص' : 'جديد'}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              {selectedPin.type === 'active' ? (
                <button
                  onClick={() => handleEnterLocation(selectedPin.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] font-bold text-sm shadow-md transition-all focus:ring-2 focus:ring-[#e5a744]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>دخول الموقع وتفتيش المشهد</span>
                </button>
              ) : (
                <div className="p-3 bg-[#110e0c] rounded border border-[#2b211a] text-center text-xs text-[#7e6d5d]">
                  هذا الموقع مرتبط بملفات القضايا القادمة في حي السرايا وسيتوفر عند فتح التحقيق التالي.
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 text-[#7e6d5d] text-sm">
              حدد موقعاً على الخريطة لعرض تفاصيله
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
