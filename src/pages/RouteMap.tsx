import React, { useState, useRef, useEffect } from 'react';
import { Compass, Search, ChevronRight, Cross, RotateCcw, X, Plus, Minus, Minimize2, Maximize, Minimize } from 'lucide-react';
import routeDataRaw from '../../routeData.json';

interface Coordinate {
  lat: number;
  lng: number;
}

interface RouteLocation {
  id: string;
  location_name: string;
  region: string;
  coordinates: Coordinate;
  gospel_reference: string;
  description: string;
  chronological_order: number;
}

const routeData = routeDataRaw as RouteLocation[];

// Bounding box dimensions for mapping coordinates to SVG canvas at zoom level 9
const MAP_ZOOM = 9;
const TILE_X_START = 296;
const TILE_Y_START = 198;

const CANVAS_WIDTH = 4096; // 16 tiles * 256px
const CANVAS_HEIGHT = 3840; // 15 tiles * 256px

const getCoords = (lat: number, lng: number) => {
  const latRad = (lat * Math.PI) / 180;
  // X pixel at zoom 9
  const px = ((lng + 180) / 360) * Math.pow(2, MAP_ZOOM) * 256;
  // Y pixel at zoom 9
  const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, MAP_ZOOM) * 256;
  
  return {
    x: px - TILE_X_START * 256,
    y: py - TILE_Y_START * 256
  };
};

const getOffsetCoords = (loc: RouteLocation) => {
  const base = getCoords(loc.coordinates.lat, loc.coordinates.lng);
  
  // Specific offsets for Jerusalem Temple points (2, 5, 9) to ensure they are always beautifully separated
  // and placed adjacent to one another ("рядом") without exact visual overlap under any zoom scale.
  if (loc.chronological_order === 2) {
    return { x: base.x - 22, y: base.y - 12 };
  }
  if (loc.chronological_order === 5) {
    return { x: base.x + 22, y: base.y - 12 };
  }
  if (loc.chronological_order === 9) {
    return { x: base.x, y: base.y + 18 };
  }
  return base;
};

const backgroundTiles: { x: number; y: number }[] = [];
for (let y = 198; y <= 212; y++) {
  for (let x = 296; x <= 311; x++) {
    backgroundTiles.push({ x, y });
  }
}

const ruLabels = [
  { name: 'ИЕРУСАЛИМ', lat: 31.7767, lng: 35.19, size: 52, color: '#ac2e2e', weight: 'bold', tracking: '0.12em', font: 'izhitsa' },
  { name: 'ВИФЛЕЕМ', lat: 31.7054, lng: 35.15, size: 38, color: '#ac2e2e', weight: 'semibold', tracking: '0.08em', font: 'izhitsa' },
  { name: 'НАЗАРЕТ', lat: 32.7019, lng: 35.25, size: 48, color: '#ac2e2e', weight: 'bold', tracking: '0.12em', font: 'izhitsa' },
  { name: 'КАПЕРНАУМ', lat: 32.8808, lng: 35.5752, size: 36, color: '#ac2e2e', weight: 'semibold', tracking: '0.08em', font: 'izhitsa' },
  { name: 'Средиземное море', lat: 32.2, lng: 33.3, size: 85, color: '#4a6b82', italic: true, tracking: '0.25em', rotate: -15 },
  { name: 'Мёртвое море', lat: 31.43, lng: 35.53, size: 36, color: '#4a6b82', italic: true, tracking: '0.08em', rotate: -90 },
  { name: 'Гал. море', lat: 32.81, lng: 35.65, size: 34, color: '#4a6b82', italic: true },
  { name: 'Синайский п-ов', lat: 29.7, lng: 33.85, size: 82, color: '#8c764e', tracking: '0.25em' },
  { name: 'Египет', lat: 30.0, lng: 31.5, size: 90, color: '#8c764e', tracking: '0.25em' },
  { name: 'р. Иордан', lat: 32.18, lng: 35.61, size: 30, color: '#4a6b82', rotate: -90 },
  { name: 'ИУДЕЯ', lat: 31.55, lng: 35.08, size: 70, color: '#8c764e', tracking: '0.2em' },
  { name: 'ГАЛИЛЕЯ', lat: 32.74, lng: 35.35, size: 70, color: '#8c764e', tracking: '0.2em' },
  { name: 'САМАРИЯ', lat: 32.20, lng: 35.25, size: 64, color: '#8c764e', tracking: '0.18em' },
];

export default function RouteMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 292 });
  const [scale, setScale] = useState<number>(0.38);
  const [panX, setPanX] = useState<number>(-320);
  const [panY, setPanY] = useState<number>(-120);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // References to keep event listeners perfectly synced (avoiding stale captures)
  const scaleRef = useRef(scale);
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { panXRef.current = panX; }, [panX]);
  useEffect(() => { panYRef.current = panY; }, [panY]);

  // Touch gesture state values tracked via refs
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1);
  const touchStartCenterRef = useRef<{ x: number; y: number } | null>(null);
  const touchDragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchDraggingRef = useRef<boolean>(false);

  // Lock body scroll in fullscreen mode to prevent scrolling leaks
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  // Dynamically observe container dimensions to keep coordinates perfectly mapped
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 292
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    resizeObserver.observe(containerRef.current);

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Set up touch event listeners strictly matching passive=false to allow preventDefault()
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isInteractive = (target: EventTarget | null): boolean => {
      let currentEl = target as HTMLElement | null;
      while (currentEl && currentEl !== el) {
        if (
          currentEl.tagName === 'BUTTON' || 
          currentEl.tagName === 'A' || 
          currentEl.tagName === 'INPUT' ||
          currentEl.tagName === 'SELECT' ||
          currentEl.classList?.contains('cursor-pointer') || 
          currentEl.getAttribute?.('role') === 'button'
        ) {
          return true;
        }
        currentEl = currentEl.parentElement;
      }
      return false;
    };

    const getDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (t1: Touch, t2: Touch) => {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };
    };

    const handleTStart = (e: TouchEvent) => {
      // If user is pinching (>= 2 fingers), ALWAYS prevent default to block browser/body-level pinch zoom
      if (e.touches.length >= 2) {
        e.preventDefault();
      }

      // If user is touching a button, marker or search input - do not start drag/zoom gesture
      if (isInteractive(e.target)) {
        isTouchDraggingRef.current = false;
        return;
      }

      // Prevent page scrolling/bouncing from map dragging on touch
      if (e.touches.length === 1) {
        e.preventDefault();
      }

      if (e.touches.length === 1) {
        isTouchDraggingRef.current = true;
        touchDragStartRef.current = {
          x: e.touches[0].clientX - panXRef.current,
          y: e.touches[0].clientY - panYRef.current
        };
        setIsDragging(true);
      } else if (e.touches.length === 2) {
        isTouchDraggingRef.current = false;
        const dist = getDistance(e.touches[0], e.touches[1]);
        touchStartDistRef.current = dist;
        touchStartScaleRef.current = scaleRef.current;

        const rect = el.getBoundingClientRect();
        const center = getCenter(e.touches[0], e.touches[1]);
        const relativeCenterX = center.x - rect.left;
        const relativeCenterY = center.y - rect.top;

        touchStartCenterRef.current = {
          x: relativeCenterX,
          y: relativeCenterY
        };
      }
    };

    const handleTMove = (e: TouchEvent) => {
      // Block all multi-finger browser-level zooms under any circumstance
      if (e.touches.length >= 2) {
        e.preventDefault();
      }

      const isDraggingNow = e.touches.length === 1 && isTouchDraggingRef.current && touchDragStartRef.current;
      const isPinchingNow = e.touches.length === 2 && touchStartDistRef.current && touchStartCenterRef.current;

      if (isDraggingNow || isPinchingNow) {
        e.preventDefault();
      } else {
        return;
      }

      if (isDraggingNow && touchDragStartRef.current) {
        const nextX = e.touches[0].clientX - touchDragStartRef.current.x;
        const nextY = e.touches[0].clientY - touchDragStartRef.current.y;
        setPanX(nextX);
        setPanY(nextY);
      } else if (isPinchingNow && touchStartDistRef.current && touchStartCenterRef.current) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        if (dist === 0) return;

        const scaleDiff = dist / touchStartDistRef.current;
        const targetScaleUnclamped = scaleDiff * touchStartScaleRef.current;
        const clampedScale = Math.min(Math.max(targetScaleUnclamped, 0.08), 72.0);

        const mouseX = touchStartCenterRef.current.x;
        const mouseY = touchStartCenterRef.current.y;

        const oldX = (mouseX - panXRef.current) / scaleRef.current;
        const oldY = (mouseY - panYRef.current) / scaleRef.current;

        const newPanX = mouseX - oldX * clampedScale;
        const newPanY = mouseY - oldY * clampedScale;

        setScale(clampedScale);
        setPanX(newPanX);
        setPanY(newPanY);
      }
    };

    const handleTEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isTouchDraggingRef.current = false;
        touchDragStartRef.current = null;
        touchStartDistRef.current = null;
        touchStartCenterRef.current = null;
        setIsDragging(false);
      } else if (e.touches.length === 1) {
        // If single touch remains, verify we aren't starting dragging from an interactive point
        if (isInteractive(e.touches[0].target)) {
          isTouchDraggingRef.current = false;
          touchDragStartRef.current = null;
          return;
        }
        isTouchDraggingRef.current = true;
        touchDragStartRef.current = {
          x: e.touches[0].clientX - panXRef.current,
          y: e.touches[0].clientY - panYRef.current
        };
        touchStartDistRef.current = null;
        touchStartCenterRef.current = null;
      }
    };

    const handleGesture = (e: Event) => {
      // Prevent Safari's native multi-touch zoom behaviors
      e.preventDefault();
    };

    el.addEventListener('touchstart', handleTStart, { passive: false });
    el.addEventListener('touchmove', handleTMove, { passive: false });
    el.addEventListener('touchend', handleTEnd, { passive: false });
    el.addEventListener('gesturestart', handleGesture, { passive: false });
    el.addEventListener('gesturechange', handleGesture, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTStart);
      el.removeEventListener('touchmove', handleTMove);
      el.removeEventListener('touchend', handleTEnd);
      el.removeEventListener('gesturestart', handleGesture);
      el.removeEventListener('gesturechange', handleGesture);
    };
  }, []);

  // Map region names to Russian labels for tabs
  const regionLabels: { [key: string]: string } = {
    all: 'Все регионы',
    'Иудея': 'Иудея',
    'Иерусалим': 'Иерусалим',
    'Иудея (Иерусалим)': 'Иерусалим',
    'Галилея': 'Галилея',
    'Самария': 'Самария',
    'Египет': 'Египет',
    'Иорданская долина': 'Иордан',
    'Иудейская пустыня': 'Пустыня',
    'Заиорданье': 'Заиорданье',
    'Галилея (север)': 'Северная Галилея',
    'Иудея / Иорданская долина': 'Иерихон/Иордан'
  };

  const cleanRegionName = (region: string): string => {
    if (region.includes('Иерусалим')) return 'Иерусалим';
    if (region.includes('Иордан')) return 'Иордан';
    return region;
  };

  // Grouped regional categories for simpler navigation tabs
  const groupRegions = (loc: RouteLocation): string => {
    const r = loc.region.toLowerCase();
    const l = loc.location_name.toLowerCase();
    if (r.includes('ерусалим') || r.includes('сион') || r.includes('елеон') || l.includes('иерусалим')) return 'Иерусалим';
    if (r.includes('иудея') || r.includes('пустыня') || r.includes('вифания') || r.includes('иерихон')) return 'Иудея';
    if (r.includes('галилея')) return 'Галилея';
    if (r.includes('самария')) return 'Самария';
    if (r.includes('египет')) return 'Египет';
    if (r.includes('иордан')) return 'Иорданская долина';
    return 'Другие';
  };

  const filteredLocations = routeData.filter((loc) => {
    const matchesSearch = 
      loc.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.gospel_reference.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedRegion === 'all') return matchesSearch;
    return groupRegions(loc) === selectedRegion && matchesSearch;
  });

  // Calculate bounding box and smoothly fit search results within viewport with optimal padding
  const fitBoundingBox = (locations: RouteLocation[]) => {
    if (!containerRef.current || locations.length === 0) return;
    
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 292;
    
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    
    locations.forEach(loc => {
      const coords = getOffsetCoords(loc);
      if (coords.x < minX) minX = coords.x;
      if (coords.x > maxX) maxX = coords.x;
      if (coords.y < minY) minY = coords.y;
      if (coords.y > maxY) maxY = coords.y;
    });

    const padding = 22; // visual margin padding on screen
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    
    let targetScale = 1.0;
    let targetPanX = 0;
    let targetPanY = 0;

    if (boxWidth < 10 || boxHeight < 10) {
      // Single marker case
      targetScale = 4.5;
      targetPanX = (width / 2) - (minX * targetScale);
      targetPanY = (height / 2) - (minY * targetScale);
    } else {
      // Fit multiple markers
      const scaleX = (width - padding * 2) / boxWidth;
      const scaleY = (height - padding * 2) / boxHeight;
      targetScale = Math.min(scaleX, scaleY);
      
      // Limit scale to avoid over-zooming or zooming out into empty space
      targetScale = Math.min(Math.max(targetScale, 0.08), 7.0);
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      targetPanX = (width / 2) - (centerX * targetScale);
      targetPanY = (height / 2) - (centerY * targetScale);
    }
    
    setScale(targetScale);
    setPanX(targetPanX);
    setPanY(targetPanY);
  };

  // Re-fit maps dynamically whenever filtering or viewport dimensions change
  React.useEffect(() => {
    if (activeLocation === null) {
      fitBoundingBox(filteredLocations);
    }
  }, [selectedRegion, searchQuery, dimensions.width, dimensions.height]);

  // Center and zoom into a location
  const centerOnLocation = (loc: RouteLocation, targetScale = 4.5) => {
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;
    
    const coords = getOffsetCoords(loc);
    const newPanX = (displayWidth / 2) - (coords.x * targetScale);
    const newPanY = (displayHeight / 2) - (coords.y * targetScale);
    
    setScale(targetScale);
    setPanX(newPanX);
    setPanY(newPanY);
    setActiveLocation(loc.chronological_order);
    
    // Smooth scroll key elements to prevent UX jumps
    const mapElement = document.getElementById('route-map-viewport');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom with cursor centering logic
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 1.12;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    const clampedScale = Math.min(Math.max(nextScale, 0.08), 72.0);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const oldX = (mouseX - panX) / scale;
    const oldY = (mouseY - panY) / scale;
    
    const newPanX = mouseX - oldX * clampedScale;
    const newPanY = mouseY - oldY * clampedScale;
    
    setScale(clampedScale);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleZoomIn = () => {
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;
    const clampedScale = Math.min(scale * 1.3, 72.0);
    const newPanX = (displayWidth / 2) - ((displayWidth / 2 - panX) / scale) * clampedScale;
    const newPanY = (displayHeight / 2) - ((displayHeight / 2 - panY) / scale) * clampedScale;
    setScale(clampedScale);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleZoomOut = () => {
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;
    const clampedScale = Math.max(scale / 1.3, 0.08);
    const newPanX = (displayWidth / 2) - ((displayWidth / 2 - panX) / scale) * clampedScale;
    const newPanY = (displayHeight / 2) - ((displayHeight / 2 - panY) / scale) * clampedScale;
    setScale(clampedScale);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const resetMap = () => {
    setActiveLocation(null);
    setSelectedRegion('all');
    setSearchQuery('');
    fitBoundingBox(routeData);
  };

  const activeLoc = activeLocation !== null 
    ? routeData.find(loc => loc.chronological_order === activeLocation) 
    : null;

  // Visible viewport boundaries in SVG/zoom-9 canvas coordinate system
  const pad = 128 / scale; // add a comfortable buffer of pixels based on current zoom scale to preload tiles slightly out of view
  const visibleXMin = -panX / scale - pad;
  const visibleXMax = (dimensions.width - panX) / scale + pad;
  const visibleYMin = -panY / scale - pad;
  const visibleYMax = (dimensions.height - panY) / scale + pad;

  // Calculate zoom delta based on active scaling level (up to 6 steps deeper, Zoom level 15 @2x)
  const zoomDelta = Math.min(Math.max(Math.floor(Math.log2(scale)), 0), 6);

  // Path polyline coordinates for the sequential journey
  const pathData = routeData
    .slice()
    .sort((a, b) => a.chronological_order - b.chronological_order)
    .map(loc => {
      const coords = getOffsetCoords(loc);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="space-y-4">
      {/* Introduction */}
      {!isFullScreen && (
        <div className="bg-[#fdfbf6] p-4 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-cinnabar)]/10 rounded-xl text-[var(--color-cinnabar)] shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-sans font-medium text-[var(--color-ink)]/85 leading-relaxed m-0 select-text">
                Интерактивный путеводитель по местам пребывания Спасителя нашего Иисуса Христа
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Viewport Area */}
      <div 
        id="route-map-viewport" 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={isFullScreen 
          ? "fixed inset-0 z-50 bg-[#faf6ee] w-full h-[100dvh] m-0 rounded-none border-none select-none cursor-grab active:cursor-grabbing touch-none"
          : "relative w-full h-[292px] rounded-2xl overflow-hidden border border-[var(--color-cinnabar)]/20 shadow-md bg-[#faf6ee] select-none cursor-grab active:cursor-grabbing touch-none"
        }
      >
        {/* Interactive SVG Layer */}
        <svg 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
          className={`w-full select-none ${isFullScreen ? "h-[100dvh]" : "h-[292px]"}`}
        >
          {/* Main Transformed Coordinate System */}
          <g 
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
              transformOrigin: '0px 0px',
              transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Render dynamic, high-resolution CartoDB Voyager tiles adapted to current zoom */}
            {backgroundTiles.map((tile) => {
              const tileXMin = (tile.x - TILE_X_START) * 256;
              const tileXMax = tileXMin + 256;
              const tileYMin = (tile.y - TILE_Y_START) * 256;
              const tileYMax = tileYMin + 256;

              const isVisible = 
                tileXMax >= visibleXMin && tileXMin <= visibleXMax &&
                tileYMax >= visibleYMin && tileYMin <= visibleYMax;

              if (!isVisible) return null;

              if (zoomDelta > 0) {
                const subTiles = [];
                const d = zoomDelta;
                const limit = Math.pow(2, d);
                const size = 256 / limit;

                // Index-bounded range performance optimizations (O(visible) instead of O(2^2d))
                const iStart = Math.max(0, Math.floor((visibleXMin - tileXMin) / size) - 1);
                const iEnd = Math.min(limit - 1, Math.floor((visibleXMax - tileXMin) / size) + 1);
                const jStart = Math.max(0, Math.floor((visibleYMin - tileYMin) / size) - 1);
                const jEnd = Math.min(limit - 1, Math.floor((visibleYMax - tileYMin) / size) + 1);

                for (let j = jStart; j <= jEnd; j++) {
                  for (let i = iStart; i <= iEnd; i++) {
                    const posX = tileXMin + i * size;
                    const posY = tileYMin + j * size;

                    const subX = tile.x * limit + i;
                    const subY = tile.y * limit + j;
                    
                    subTiles.push({
                      key: `${subX}-${subY}-${d}`,
                      href: `https://basemaps.cartocdn.com/rastertiles/voyager/${9 + d}/${subX}/${subY}@2x.png`,
                      x: posX,
                      y: posY,
                      size: size
                    });
                  }
                }

                return (
                  <g key={`${tile.x}-${tile.y}-group`}>
                    {/* Fallback low-res tile under high-res sub-tiles to eliminate flickers during lazy-loading */}
                    <image
                      href={`https://basemaps.cartocdn.com/rastertiles/voyager/9/${tile.x}/${tile.y}@2x.png`}
                      x={tileXMin}
                      y={tileYMin}
                      width={256}
                      height={256}
                    />
                    {subTiles.map(sub => (
                      <image
                        key={sub.key}
                        href={sub.href}
                        x={sub.x}
                        y={sub.y}
                        width={sub.size}
                        height={sub.size}
                      />
                    ))}
                  </g>
                );
              }

              return (
                <image
                  key={`${tile.x}-${tile.y}`}
                  href={`https://basemaps.cartocdn.com/rastertiles/voyager/9/${tile.x}/${tile.y}@2x.png`}
                  x={tileXMin}
                  y={tileYMin}
                  width={256}
                  height={256}
                />
              );
            })}

            {/* Semi-transparent historical parchment shading on top of the map tiles */}
            <rect 
              width={CANVAS_WIDTH} 
              height={CANVAS_HEIGHT} 
              fill="#faf6ee" 
              opacity="0.12" 
              style={{ pointerEvents: 'none' }} 
            />

            {/* Ancient Compass Rose decoration located at Sinai/Sin Peninsula coordinates */}
            {(() => {
              const compassCoords = getCoords(29.4, 33.8);
              return (
                <g transform={`translate(${compassCoords.x}, ${compassCoords.y}) scale(${1.65 / Math.sqrt(scale)})`} opacity="0.65" style={{ pointerEvents: 'none' }}>
                  <circle cx="0" cy="0" r="30" fill="#fdfbf6" fillOpacity="0.8" stroke="#ac2e2e" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="-40" y1="0" x2="40" y2="0" stroke="#ac2e2e" strokeWidth="1" />
                  <line x1="0" y1="-40" x2="0" y2="40" stroke="#ac2e2e" strokeWidth="2" />
                  <polygon points="0,-45 5,-10 0,0 -5,-10" fill="#ac2e2e" />
                  <polygon points="0,45 5,10 0,0 -5,10" fill="#7a1a1a" />
                  <polygon points="45,0 10,5 0,0 10,-5" fill="#ac2e2e" />
                  <polygon points="-45,0 -10,5 0,0 -10,-5" fill="#7a1a1a" />
                  <text x="-4.5" y="-48" fill="#ac2e2e" fontSize="11" fontWeight="bold" className="font-serif">N</text>
                </g>
              );
            })()}

            {/* Overlying beautiful geographical, city, and sea labels in Russian */}
            <g style={{ pointerEvents: 'none' }}>
              {ruLabels.map((lbl, idx) => {
                const coords = getCoords(lbl.lat, lbl.lng);
                const isRegionOrSea = ['ИУДЕЯ', 'ГАЛИЛЕЯ', 'САМАРИЯ', 'Синайский п-ов', 'Египет', 'Средиземное море', 'Мёртвое море'].includes(lbl.name);
                
                // Adaptive visual scaling factor (exponential shrink rate): 
                // As scale increases, regions shrink very rapidly, while towns/places shrink gently.
                const exponent = isRegionOrSea ? 0.85 : 0.45;
                const sizeFactor = 0.16 * Math.pow(0.38 / scale, exponent);
                const fontSizeValue = (lbl.size * sizeFactor) / scale;
                
                // Soft opacity fading so labels recede gracefully during deep zoom
                let opacityValue = 0.65;
                if (isRegionOrSea) {
                  if (scale > 0.38) {
                    opacityValue = Math.max(0.12, 0.65 - (scale - 0.38) * 0.15);
                  }
                } else {
                  if (scale > 0.38) {
                    opacityValue = Math.max(0.18, 0.65 - (scale - 0.38) * 0.08);
                  }
                }
                
                return (
                  <text
                    key={idx}
                    x={coords.x}
                    y={coords.y}
                    fill={lbl.color}
                    fontSize={fontSizeValue}
                    fontWeight={lbl.weight || 'normal'}
                    fontStyle={lbl.italic ? 'italic' : 'normal'}
                    className={lbl.font === 'izhitsa' ? 'font-izhitsa' : 'font-sans'}
                    transform={lbl.rotate ? `rotate(${lbl.rotate}, ${coords.x}, ${coords.y})` : undefined}
                    letterSpacing={lbl.tracking}
                    opacity={opacityValue}
                    textAnchor="middle"
                  >
                    {lbl.name}
                  </text>
                );
              })}
            </g>

            {/* Dotted Sequential Polyline Connecting all 23 historical coordinates */}
            <polyline 
              points={pathData} 
              fill="none" 
              stroke="#ac2e2e" 
              strokeWidth={2.2 / scale} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeDasharray={`${4 / scale},${6 / scale}`} 
              opacity="0.85"
            />

            {/* Render 23 Interactive Custom Markers with beautiful scale-responsive proportions */}
            {routeData.map((loc) => {
              const coords = getOffsetCoords(loc);
              const isActive = activeLocation === loc.chronological_order;
              
              // To keep visual sizes of markers nearly constant regardless of map zoom (scale):
              const baseR = isActive ? 13 : 9;
              const r = baseR / scale;
              const strokeWidthCustom = (isActive ? 2.5 : 1.5) / scale;
              const fontSizeCustom = (isActive ? 11 : 8.5) / scale;
              
              const rectWidth = (isActive ? 92 : 78) / scale;
              const rectHeight = 16 / scale;
              const rxUniform = 3 / scale;
              const labelFontSizeCustom = 8 / scale;
              
              const labelYOffset = -(r + 11 / scale);

              return (
                <g 
                  key={loc.id} 
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLocation(loc.chronological_order)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    centerOnLocation(loc, Math.max(scale, 6.0));
                  }}
                >
                  {/* Outer Pulsing Aura (only for active location) */}
                  {isActive && (
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={24 / scale} 
                      fill="none" 
                      stroke="#ac2e2e" 
                      strokeWidth={2 / scale} 
                      className="animate-pulse" 
                    />
                  )}

                  {/* Circle shadow (using scaled layout) */}
                  <circle cx="0" cy={1 / scale} r={r} fill="rgba(0,0,0,0.18)" />

                  {/* Solid core circle */}
                  <circle 
                  cx="0" 
                  cy="0" 
                  r={r} 
                  fill={isActive ? '#ac2e2e' : '#ffffff'} 
                  stroke={isActive ? '#ffd58e' : '#ac2e2e'} 
                  strokeWidth={strokeWidthCustom} 
                  />

                  {/* Order numeral */}
                  <text 
                    x="0" 
                    y="0" 
                    dominantBaseline="central"
                    textAnchor="middle" 
                    fontSize={`${fontSizeCustom}px`} 
                    fontFamily="monospace" 
                    fontWeight="bold" 
                    fill={isActive ? '#ffffff' : '#ac2e2e'}
                  >
                    {loc.chronological_order}
                  </text>

                  {/* Small dynamic text label display above marker (active, hovered or at close-up scale) */}
                  {(isActive || hoveredLocation === loc.chronological_order || scale >= 5.0) && (
                    <g transform={`translate(0, ${labelYOffset})`}>
                      <rect 
                        x={-rectWidth / 2} 
                        y={-rectHeight / 2} 
                        width={rectWidth} 
                        height={rectHeight} 
                        rx={rxUniform} 
                        fill="rgba(253, 251, 246, 0.96)" 
                        stroke="#ac2e2e" 
                        strokeWidth={1 / scale} 
                      />
                      <text 
                        x="0" 
                        y="0" 
                        dominantBaseline="central"
                        textAnchor="middle" 
                        fontSize={`${labelFontSizeCustom}px`} 
                        fontWeight="bold" 
                        fill="#ac2e2e" 
                        className="font-sans truncate"
                      >
                        {loc.location_name.split(' (')[0].split(' /')[0]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic Zoom Panning Controls */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-1 shadow-md rounded-xl overflow-hidden bg-white/95 border border-[var(--color-cinnabar)]/10 backdrop-blur-xs">
          <button 
            onClick={handleZoomIn}
            title="Увеличить"
            className="p-2 text-stone-700 hover:bg-amber-50 active:scale-95 transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut}
            title="Уменьшить"
            className="p-2 border-t border-stone-100 text-stone-700 hover:bg-amber-50 active:scale-95 transition-all outline-none"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={resetMap}
            title="Вернуть карту"
            className="p-2 border-t border-stone-100 text-[var(--color-cinnabar)] hover:bg-amber-50 active:scale-95 transition-all outline-none"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFullScreen(prev => !prev)}
            title={isFullScreen ? "Свернуть" : "Во весь экран"}
            className="p-2 border-t border-stone-100 text-stone-700 hover:bg-amber-50 active:scale-95 transition-all outline-none"
          >
            {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

        {/* Integrated Floating Card Detail Overlay (Parchment manuscript look) */}
        {activeLoc && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[380px] z-40 bg-[#fdfbf6] border-2 border-[var(--color-cinnabar)]/80 p-3 sm:p-3.5 rounded-xl shadow-xl flex flex-col justify-between max-h-[42dvh] sm:max-h-[45dvh] space-y-1.5 sm:space-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
            <div className="flex items-start justify-between gap-2 shrink-0">
              <div>
                <span className="text-[9px] bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] border border-[var(--color-cinnabar)]/15 px-2.2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Пункт {activeLoc.chronological_order} из 23
                </span>
                <h4 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] mt-1.5 leading-tight mb-0.5 select-text">
                  {activeLoc.location_name}
                </h4>
                <p className="text-[10px] text-amber-900/60 font-semibold tracking-wider uppercase m-0 select-text">
                  Регион: {activeLoc.region}
                </p>
              </div>
              <button 
                onClick={() => setActiveLocation(null)}
                className="text-stone-400 hover:text-[var(--color-cinnabar)] p-1.5 transition-colors"
                title="Закрыть подробности"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-[var(--color-cinnabar)] flex items-center gap-1.5 m-0 pt-0.5 select-text shrink-0">
              <span>📖 {activeLoc.gospel_reference}</span>
            </p>
            <div className="overflow-y-auto pr-1 flex-1 min-h-0">
              <p className="text-xs text-[var(--color-ink)]/90 leading-relaxed m-0 text-justify select-text">
                {activeLoc.description}
              </p>
            </div>
            {/* Step coordinates stepper */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-cinnabar)]/10 shrink-0">
              <button
                disabled={activeLoc.chronological_order === 1}
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = routeData.find(l => l.chronological_order === activeLoc.chronological_order - 1);
                  if (prev) centerOnLocation(prev, Math.max(scale, 5.0));
                }}
                className="px-2.5 py-1 text-[10px] uppercase font-bold text-[var(--color-cinnabar)] hover:text-red-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                ← Назад
              </button>
              <button
                disabled={activeLoc.chronological_order === 23}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = routeData.find(l => l.chronological_order === activeLoc.chronological_order + 1);
                  if (next) centerOnLocation(next, Math.max(scale, 5.0));
                }}
                className="px-2.5 py-1 text-[10px] uppercase font-bold text-[var(--color-cinnabar)] hover:text-red-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Вперед →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      <div className="space-y-2">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveLocation(null);
            }}
            placeholder="Поиск по местам, Евангелию или описанию..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#fdfbf6] rounded-xl border border-[var(--color-cinnabar)]/15 focus:outline-none focus:ring-1 focus:ring-[var(--color-cinnabar)] font-sans text-[var(--color-ink)] placeholder-stone-400"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Quick Regions filter pillbox */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none drag-scroll">
          {['all', 'Иудея', 'Иерусалим', 'Галилея', 'Самария', 'Египет', 'Иорданская долина'].map((reg) => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => {
                  setSelectedRegion(reg);
                  setActiveLocation(null);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap tracking-wider uppercase transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[var(--color-cinnabar)] text-white shadow-sm'
                    : 'bg-[#fdfbf6] text-[var(--color-ink)]/70 hover:bg-stone-100 border border-[var(--color-cinnabar)]/5'
                }`}
              >
                {regionLabels[reg] || reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stations Scrolling Index List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc) => {
            const isActive = activeLocation === loc.chronological_order;
            return (
              <div
                key={loc.id}
                onClick={() => centerOnLocation(loc, 6.0)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 text-left items-start ${
                  isActive
                    ? 'bg-amber-50/75 border-[var(--color-cinnabar)] shadow-sm'
                    : 'bg-[#fdfbf6] border-[var(--color-cinnabar)]/10 hover:border-[var(--color-cinnabar)]/30 hover:shadow-xs'
                }`}
              >
                {/* Number Badge */}
                <div 
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold shrink-0 border transition-colors ${
                    isActive 
                      ? 'bg-[var(--color-cinnabar)] text-white border-amber-300' 
                      : 'bg-stone-100 text-[var(--color-ink)]/70 border-stone-200'
                  }`}
                >
                  {loc.chronological_order}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-sans font-bold text-sm text-[var(--color-ink)] leading-tight truncate">
                      {loc.location_name}
                    </h4>
                    <span className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider shrink-0">
                      {cleanRegionName(loc.region)}
                    </span>
                  </div>
                  
                  <p className="text-[11px] font-semibold text-[var(--color-cinnabar)] flex items-center gap-1">
                    <span>📖 {loc.gospel_reference}</span>
                  </p>
                  
                  <p className="text-xs text-[var(--color-ink)]/75 line-clamp-2 md:line-clamp-none leading-relaxed">
                    {loc.description}
                  </p>
                </div>

                <div className="shrink-0 pt-1">
                  <ChevronRight className="w-4 h-4 text-[var(--color-cinnabar)]/40" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#fdfbf6] p-8 rounded-2xl border border-[var(--color-cinnabar)]/10 text-center text-sm text-[var(--color-ink)]/60">
            Ничего не найдено по введенному запросу. Попробуйте изменить фильтры или строку поиска.
          </div>
        )}
      </div>
    </div>
  );
}
