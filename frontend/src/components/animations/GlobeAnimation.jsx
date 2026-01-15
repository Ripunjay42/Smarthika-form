import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';
import { User, Users, Calendar, Navigation, MapPin, Loader2 } from 'lucide-react';
import * as d3 from 'd3';
import { feature as topojsonFeature } from 'topojson-client';

const THEME = {
  primary: '#9ca3af',
  primaryLight: '#d1d5db',
  secondary: '#d1d5db',
  water: '#b3b3b3',
  waterLight: '#e5e7eb',
  background: '#f9fafb',
  pipe: '#9ca3af',
  text: '#374151',
  textMuted: '#9ca3af',
};

// Inject CSS for state-selected class for better performance
const styleSheet = typeof document !== 'undefined' ? (() => {
  const style = document.createElement('style');
  style.textContent = `
    .state-path.state-selected {
      fill: var(--color-accent) !important;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1)) !important;
    }
  `;
  document.head.appendChild(style);
  return style;
})() : null;

// Normalize state name for comparison (outside component for no recreation)
const normalizeStateName = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '').replace(/&/g, '').replace(/-/g, '');
};

export default function GlobeAnimation({ 
  farmerName = '', 
  whatsappNumber = '', 
  laborCount = 0,
  age = 0,
  country = '',
  state = '',
  village = ''
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const pathsRef = useRef(null); // Cache D3 selection
  const markerRef = useRef(null); // Cache marker group
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Memoize normalized state to avoid recalculation
  const selectedStateNormalized = useMemo(() => normalizeStateName(state), [state]);

  // Fetch GeoJSON on mount (only once)
  useEffect(() => {
    const fetchMapData = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        // Load bundled map from same origin (reliable after deploy)
        const response = await fetch('/maps/ind.topo.json', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error("Failed to load map data");
        let data = await response.json();

        // If it's TopoJSON, convert to GeoJSON FeatureCollection
        if (data && data.type === 'Topology' && data.objects) {
          const objectKey = data.objects.ind ? 'ind' : Object.keys(data.objects)[0];
          const geo = topojsonFeature(data, data.objects[objectKey]);
          data = geo.type === 'Feature'
            ? { type: 'FeatureCollection', features: [geo] }
            : geo;
        }
        
        // Normalize property names for consistent access
        if (data.features) {
          data.features = data.features.map(feature => {
            const name = feature.properties?.NAME_1 || feature.properties?.NAME || feature.properties?.name || feature.properties?.ST_NM || 'Unknown';
            return {
              ...feature,
              properties: {
                NAME_1: name,
                name: name,
                ...feature.properties
              }
            };
          });
        }
        
        setGeoData(data);
        setLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Map loading error:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Initial map render (only when geoData loads) - ONCE
  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Clear only once
    svg.selectAll("*").remove();

    // Responsive scale - smaller on large screens
    let scale = Math.min(width * 1.5, height * 1.5);
    if (width > 1400) scale *= 0.65;
    else if (width > 1000) scale *= 0.75;
    else if (width > 768) scale *= 0.85;

    // Define Projection
    const projection = d3.geoMercator()
      .center([82, 23]) 
      .scale(scale) 
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Render states ONCE and cache selection - use SVG rendering mode for performance
    const mapGroup = svg.append("g").attr("class", "map-group").attr("vector-effect", "non-scaling-stroke");

    pathsRef.current = mapGroup.selectAll("path")
      .data(geoData.features, (d) => d.properties.NAME_1 || d.properties.name)
      .enter()
      .append("path")
      .attr("d", (d) => pathGenerator(d))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.8)
      .attr("fill", 'rgba(180, 180, 180, 0.4)')
      .attr("class", "state-path")
      .attr("data-state", (d) => normalizeStateName(d.properties.NAME_1 || d.properties.name || ''))
      .attr("will-change", "fill")
      .style("transition", "fill 0.15s ease"); // Hardware accelerated

    // Create marker group once
    markerRef.current = svg.append("g").attr("class", "state-marker").style("display", "none").attr("will-change", "transform");

  }, [geoData]);

  // Ultra-optimized state update using requestAnimationFrame
  useEffect(() => {
    if (!geoData || !pathsRef.current || !selectedStateNormalized) return;

    // Batch DOM updates in single frame
    const frameId = requestAnimationFrame(() => {
      // Update fills using cached selection with CSS class instead of inline
      pathsRef.current.classed("state-selected", function() {
        const stateName = this.getAttribute('data-state');
        return stateName === selectedStateNormalized;
      });

      // Update marker
      if (markerRef.current) {
        const marker = d3.select(markerRef.current.node());
        marker.selectAll("*").remove();

        if (selectedStateNormalized) {
          const selectedFeature = geoData.features.find(f => {
            const stateName = f.properties.NAME_1 || f.properties.name || '';
            return normalizeStateName(stateName) === selectedStateNormalized;
          });

          if (selectedFeature) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            
            // Responsive scale - smaller on large screens
            let scale = Math.min(width * 1.5, height * 1.5);
            if (width > 1400) scale *= 0.65;
            else if (width > 1000) scale *= 0.75;
            else if (width > 768) scale *= 0.85;

            const projection = d3.geoMercator()
              .center([82, 23]) 
              .scale(scale) 
              .translate([width / 2, height / 2]);
            const pathGenerator = d3.geoPath().projection(projection);
            const centroid = pathGenerator.centroid(selectedFeature);
            
            if (!isNaN(centroid[0])) {
              marker.attr("transform", `translate(${centroid[0]}, ${centroid[1]})`).style("display", "block");

              marker.append("circle")
                .attr("r", 3)
                .attr("fill", THEME.text)
                .attr("will-change", "transform");
              
              marker.append("circle")
                .attr("r", 3)
                .attr("fill", "none")
                .attr("stroke", THEME.accent)
                .attr("stroke-width", 1.5)
                .attr("will-change", "r")
                .append("animate")
                .attr("attributeName", "r")
                .attr("from", "3")
                .attr("to", "14")
                .attr("dur", "1.2s")
                .attr("repeatCount", "indefinite");
            }
          }
        } else {
          marker.style("display", "none");
        }
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [geoData, selectedStateNormalized]);

  if (loading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
        <div className="flex items-center gap-2" style={{ color: THEME.accent }}>
          <Loader2 className="animate-spin" size={24} />
          <span className="text-sm font-medium">Loading Map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-8 text-center" style={{ backgroundColor: THEME.background }}>
        <div style={{ color: THEME.textLight }}>
          <p className="font-bold">Map Visualization Unavailable</p>
          <p className="text-xs mt-2">Could not load map data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      
      {/* India Map SVG */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Farmer Name Card */}
      {farmerName && (
        <motion.div
          className="absolute top-16 left-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)', willChange: 'transform' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
          transition={{ y: { duration: 4, repeat: Infinity } }}
        >
          <div className="flex items-center gap-2">
            <User size={16} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>FARMER</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{farmerName}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Age Card */}
      {age > 0 && (
        <motion.div
          className="absolute top-40 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)', willChange: 'transform' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
          transition={{ y: { duration: 4, repeat: Infinity, delay: 0.3 } }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>AGE</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{age} yrs</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* WhatsApp Card */}
      {whatsappNumber && (
        <motion.div
          className="absolute top-16 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)', willChange: 'transform' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
          transition={{ y: { duration: 4, repeat: Infinity, delay: 0.6 } }}
        >
          <div className="flex items-center gap-2">
            <Navigation size={16} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CONTACT</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>+91 {whatsappNumber}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Location Card */}
      {village && (
        <motion.div
          className="absolute bottom-24 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Navigation size={16} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>LOCATION</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{village}</p>
              {state && <p className="text-xs capitalize" style={{ color: THEME.textLight }}>{state.replace(/-/g, ' ')}</p>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Labor Count Card */}
      {laborCount > 0 && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)', willChange: 'transform' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, 14, 20] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Users size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>WORKFORCE</p>
              <p className="text-base font-bold" style={{ color: THEME.text }}>{laborCount}</p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
