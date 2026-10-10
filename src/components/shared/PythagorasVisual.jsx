import React from 'react';

/**
 * High-contrast SVG label pill with dark solid background and glowing border.
 * Guarantees zero text collision with geometry lines.
 */
function LabelPill({
  x,
  y,
  text,
  color = '#38bdf8',
  bg = '#10072b',
  border = color,
  fontSize = 13,
  fontWeight = '800'
}) {
  const str = String(text);
  const approxWidth = Math.max(str.length * (fontSize * 0.62) + 16, 36);
  const h = fontSize + 12;

  return (
    <g transform={`translate(${x}, ${y})`} pointerEvents="none">
      <rect
        x={-approxWidth / 2}
        y={-h / 2}
        width={approxWidth}
        height={h}
        rx={6}
        fill={bg}
        stroke={border}
        strokeWidth={1.75}
        filter="drop-shadow(0 2px 5px rgba(0,0,0,0.75))"
      />
      <text
        x={0}
        y={fontSize * 0.35}
        fill={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {str}
      </text>
    </g>
  );
}

/**
 * Pure SVG visual renderer for right-angled triangles and real-world scenes.
 * Features high-contrast pill markings, crisp geometry, and clear right-angle symbols.
 */
export function PythagorasVisual({ type = 'right-triangle', data = {}, compact = false }) {
  const strokeW = compact ? 2.5 : 3.2;

  // Descriptive accessibility label
  const ariaLabel = (() => {
    if (type === 'converse-check') {
      return `Triangle with sides ${(data.sides || []).join(', ')} ${data.unit || 'cm'}, not drawn to scale`;
    }
    if (type === 'field-diagonal') {
      return `Field rectangle ${data.a || 60} by ${data.b || 80} ${data.unit || 'm'} with diagonal shortcut`;
    }
    if (type === 'ladder-wall') {
      return `Ladder leaning against wall, ladder length ${data.L || data.c || 13} ${data.unit || 'm'}`;
    }
    return `Right-angled triangle with legs ${data.a || 'a'} and ${data.b || 'b'}, hypotenuse ${data.c || 'c'}`;
  })();

  const renderContent = () => {
    switch (type) {
      // -------------------------------------------------------------
      // STATION A: REAL-WORLD PARK SHORTCUT & FIELD PLANNER
      // -------------------------------------------------------------
      case 'field-shortcut':
      case 'field-planner': {
        const a = Number(data.a) || 3;
        const b = Number(data.b) || 4;
        const theta = Number(data.theta) || 90;
        const viewMode = data.viewMode || 'park'; // 'park' | 'tiles'
        const rad = (theta * Math.PI) / 180;

        const maxB = Math.max(b, 4);
        const maxA = Math.max(a, 3);
        const S = Math.min(210 / maxB, 115 / maxA);

        const ox = 95, oy = 185;
        const legB = b * S;
        const legA = a * S;

        const bx = ox + legB;
        const by = oy;
        const ax = ox - legA * Math.cos(rad);
        const ay = oy - legA * Math.sin(rad);

        const c2 = a * a + b * b - 2 * a * b * Math.cos(rad);
        const cVal = Math.sqrt(Math.max(0, c2));
        const isNinety = Math.abs(theta - 90) < 0.5;

        return (
          <g>
            {/* Real-World Park Lawn Background */}
            <rect
              x="12"
              y="12"
              width="396"
              height="216"
              rx="16"
              fill="#0d2116"
              stroke="#15803d"
              strokeWidth="1.5"
            />
            {/* Subtle Turf Grid Lines */}
            {[...Array(6)].map((_, i) => (
              <line key={`tg-${i}`} x1="12" y1={36 + i * 32} x2="408" y2={36 + i * 32} stroke="#143722" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`tgh-${i}`} x1={40 + i * 35} y1="12" x2={40 + i * 35} y2="228" stroke="#143722" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Park Interior Features: Central Pond & Trees */}
            {viewMode === 'park' && (
              <g>
                <ellipse cx="180" cy="130" rx="30" ry="18" fill="#0284c7" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                <ellipse cx="180" cy="130" rx="16" ry="9" fill="#38bdf8" fillOpacity="0.25" />
                {/* Park Trees with Canopy Glow */}
                <circle cx="145" cy="100" r="10" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
                <circle cx="148" cy="98" r="4" fill="#4ade80" fillOpacity="0.6" />
                <circle cx="230" cy="155" r="9" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
                <circle cx="232" cy="153" r="3.5" fill="#4ade80" fillOpacity="0.6" />
                {/* Park Bench */}
                <rect x="185" y="165" width="18" height="5" rx="1.5" fill="#92400e" stroke="#d97706" strokeWidth="1" />
              </g>
            )}

            {/* Plazas Mode: Render Square Tile Plazas */}
            {viewMode === 'tiles' && (
              <g>
                {/* Plaza A on North Path */}
                <polygon
                  points={`${ox},${oy} ${ox - legA},${oy} ${ox - legA},${ay} ${ox},${ay}`}
                  fill="rgba(56,189,248,0.22)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <LabelPill
                  x={ox - legA / 2}
                  y={(oy + ay) / 2}
                  text={`Plaza a² = ${a * a} m²`}
                  color="#38bdf8"
                  bg="#081426"
                  fontSize={11.5}
                />

                {/* Plaza B on East Path */}
                <polygon
                  points={`${ox},${oy} ${bx},${oy} ${bx},${oy + legB} ${ox},${oy + legB}`}
                  fill="rgba(251,146,60,0.22)"
                  stroke="#fb923c"
                  strokeWidth="2"
                />
                <LabelPill
                  x={(ox + bx) / 2}
                  y={oy + legB / 2}
                  text={`Plaza b² = ${b * b} m²`}
                  color="#fb923c"
                  bg="#1e0e0a"
                  fontSize={11.5}
                />
              </g>
            )}

            {/* Paved North Walkway (Leg a) */}
            <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
            <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#bae6fd" strokeWidth="2.5" strokeDasharray="4 3" />

            {/* Paved East Walkway (Leg b) */}
            <line x1={ox} y1={oy} x2={bx} y2={oy} stroke="#fb923c" strokeWidth="12" strokeLinecap="round" />
            <line x1={ox} y1={oy} x2={bx} y2={oy} stroke="#fed7aa" strokeWidth="2.5" strokeDasharray="4 3" />

            {/* Corner Decorative Plaza Monument / Fountain */}
            <circle cx={ox} cy={oy} r="14" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
            <circle cx={ox} cy={oy} r="5" fill="#facc15" />

            {/* Right Angle Corner Square Marker or Arc */}
            {isNinety ? (
              <g>
                <path
                  d={`M ${ox + 16} ${oy} L ${ox + 16} ${oy - 16} L ${ox} ${oy - 16}`}
                  fill="rgba(255,255,255,0.2)"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                />
                <LabelPill x={ox + 26} y={oy - 28} text="90° Corner" color="#ffffff" bg="#0f172a" border="#94a3b8" fontSize={10.5} />
              </g>
            ) : (
              <g>
                <circle cx={ox} cy={oy} r="22" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 3" />
                <LabelPill x={ox + 28} y={oy - 28} text={`${theta}°`} color="#f43f5e" bg="#1f0a14" border="#f43f5e" fontSize={11} />
              </g>
            )}

            {/* Diagonal Shortcut Promenade / Bridge (Hypotenuse c) */}
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" />
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#fef08a" strokeWidth="3" strokeDasharray="6 4" />

            {/* Pedestrian Avatars along Shortcut Bridge */}
            {(() => {
              const p1x = ax + (bx - ax) * 0.38;
              const p1y = ay + (by - ay) * 0.38;
              const p2x = ax + (bx - ax) * 0.62;
              const p2y = ay + (by - ay) * 0.62;
              return (
                <g>
                  <circle cx={p1x} cy={p1y} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx={p2x} cy={p2y} r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            })()}

            {/* End Point Plazas */}
            <circle cx={ax} cy={ay} r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle cx={bx} cy={by} r="8" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />

            {/* Dimension Line & Pill for North Path (Leg a) */}
            <line x1="38" y1={oy} x2="38" y2={ay} stroke="#38bdf8" strokeWidth="1.75" />
            <line x1="32" y1={oy} x2="44" y2={oy} stroke="#38bdf8" strokeWidth="2" />
            <line x1="32" y1={ay} x2="44" y2={ay} stroke="#38bdf8" strokeWidth="2" />
            <LabelPill
              x="42"
              y={(oy + ay) / 2}
              text={`North a = ${a} m`}
              color="#38bdf8"
              bg="#081426"
              fontSize={11.5}
            />

            {/* Dimension Line & Pill for East Path (Leg b) */}
            <line x1={ox} y1={oy + 14} x2={bx} y2={oy + 14} stroke="#fb923c" strokeWidth="1.75" />
            <line x1={ox} y1={oy + 8} x2={ox} y2={oy + 20} stroke="#fb923c" strokeWidth="2" />
            <line x1={bx} y1={oy + 8} x2={bx} y2={oy + 20} stroke="#fb923c" strokeWidth="2" />
            <LabelPill
              x={(ox + bx) / 2}
              y={oy + 22}
              text={`East b = ${b} m`}
              color="#fb923c"
              bg="#1e0e0a"
              fontSize={12}
            />

            {/* Dimension Pill for Shortcut (Hypotenuse c) */}
            <LabelPill
              x={(ax + bx) / 2 + 20}
              y={(ay + by) / 2 - 16}
              text={`Shortcut c = ${cVal.toFixed(1)} m`}
              color="#facc15"
              bg="#1c1604"
              border="#facc15"
              fontSize={13}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // STATION A: SQUARES ON SIDES (Geometric Proof)
      // -------------------------------------------------------------
      case 'squares-on-sides': {
        const a = Number(data.a) || 3;
        const b = Number(data.b) || 4;
        const theta = Number(data.theta) || 90;
        const rad = (theta * Math.PI) / 180;

        // Origin at right angle corner (0, 0)
        const O = { x: 0, y: 0 };
        const B = { x: b, y: 0 };
        const A = { x: -a * Math.cos(rad), y: -a * Math.sin(rad) };

        // Side C vector (A -> B)
        const vx = B.x - A.x;
        const vy = B.y - A.y;
        const cLen = Math.sqrt(vx * vx + vy * vy);
        const cVal = cLen;

        // Normal pointing outward away from O for Hypotenuse C
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2;
        const n1 = { x: -vy, y: vx };
        const n2 = { x: vy, y: -vx };
        const dot1 = n1.x * mx + n1.y * my;
        const Nc = dot1 > 0 ? n1 : n2;

        const C1 = { x: B.x + Nc.x, y: B.y + Nc.y };
        const C2 = { x: A.x + Nc.x, y: A.y + Nc.y };
        const cCenter = { x: (A.x + B.x + C1.x + C2.x) / 4, y: (A.y + B.y + C1.y + C2.y) / 4 };

        // Square on Leg B (points downwards, positive y)
        const B1 = { x: 0, y: b };
        const B2 = { x: b, y: b };
        const bCenter = { x: b / 2, y: b / 2 };

        // Square on Leg A (points outward away from B)
        const an1 = { x: -A.y, y: A.x };
        const an2 = { x: A.y, y: -A.x };
        const Na = an1.x * b < 0 ? an1 : an2;
        const A1 = { x: Na.x, y: Na.y };
        const A2 = { x: A.x + Na.x, y: A.y + Na.y };
        const aCenter = { x: (O.x + A.x + A1.x + A2.x) / 4, y: (O.y + A.y + A1.y + A2.y) / 4 };

        // Compute full bounding box to auto-center and scale inside 380x250 canvas
        const allPts = [O, B, A, C1, C2, B1, B2, A1, A2];
        const minX = Math.min(...allPts.map(p => p.x));
        const maxX = Math.max(...allPts.map(p => p.x));
        const minY = Math.min(...allPts.map(p => p.y));
        const maxY = Math.max(...allPts.map(p => p.y));

        const spanW = Math.max(maxX - minX, 1);
        const spanH = Math.max(maxY - minY, 1);
        const scale = Math.min(270 / spanW, 175 / spanH);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        // Projection mapping helper
        const tx = (x) => 190 + (x - cx) * scale;
        const ty = (y) => 125 + (y - cy) * scale;

        // Points in screen coords
        const sO = { x: tx(O.x), y: ty(O.y) };
        const sB = { x: tx(B.x), y: ty(B.y) };
        const sA = { x: tx(A.x), y: ty(A.y) };
        const sC1 = { x: tx(C1.x), y: ty(C1.y) };
        const sC2 = { x: tx(C2.x), y: ty(C2.y) };
        const sB1 = { x: tx(B1.x), y: ty(B1.y) };
        const sB2 = { x: tx(B2.x), y: ty(B2.y) };
        const sA1 = { x: tx(A1.x), y: ty(A1.y) };
        const sA2 = { x: tx(A2.x), y: ty(A2.y) };

        const saCenter = { x: tx(aCenter.x), y: ty(aCenter.y) };
        const sbCenter = { x: tx(bCenter.x), y: ty(bCenter.y) };
        const scCenter = { x: tx(cCenter.x), y: ty(cCenter.y) };

        const isNinety = Math.abs(theta - 90) < 0.5;

        return (
          <g>
            {/* Square on Leg A (Cyan) */}
            <polygon
              points={`${sO.x},${sO.y} ${sA1.x},${sA1.y} ${sA2.x},${sA2.y} ${sA.x},${sA.y}`}
              fill="rgba(56,189,248,0.22)"
              stroke="#38bdf8"
              strokeWidth={strokeW}
            />

            {/* Square on Leg B (Orange) */}
            <polygon
              points={`${sO.x},${sO.y} ${sB1.x},${sB1.y} ${sB2.x},${sB2.y} ${sB.x},${sB.y}`}
              fill="rgba(251,146,60,0.22)"
              stroke="#fb923c"
              strokeWidth={strokeW}
            />

            {/* Square on Hypotenuse C (Gold) */}
            <polygon
              points={`${sA.x},${sA.y} ${sB.x},${sB.y} ${sC1.x},${sC1.y} ${sC2.x},${sC2.y}`}
              fill="rgba(250,204,21,0.24)"
              stroke="#facc15"
              strokeWidth={strokeW + 0.5}
            />

            {/* Main Center Triangle */}
            <polygon
              points={`${sO.x},${sO.y} ${sB.x},${sB.y} ${sA.x},${sA.y}`}
              fill="rgba(192,132,252,0.25)"
              stroke="#ffffff"
              strokeWidth={strokeW + 0.5}
            />

            {/* Right Angle Corner Square Marker or Arc */}
            {isNinety ? (
              (() => {
                const cornerSize = Math.max(12, Math.min(18, 14 * (scale / 12)));
                return (
                  <path
                    d={`M ${sO.x + cornerSize} ${sO.y} L ${sO.x + cornerSize} ${sO.y - cornerSize} L ${sO.x} ${sO.y - cornerSize}`}
                    fill="rgba(255,255,255,0.15)"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                  />
                );
              })()
            ) : (
              <circle cx={sO.x} cy={sO.y} r={16} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 3" />
            )}

            {/* Unified Clean Badge inside Square A (Cyan) */}
            <g transform={`translate(${saCenter.x}, ${saCenter.y})`} pointerEvents="none">
              <rect
                x="-36"
                y="-20"
                width="72"
                height="40"
                rx="6"
                fill="#081426"
                stroke="#38bdf8"
                strokeWidth="1.75"
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.75))"
              />
              <text x="0" y="-4" fill="#bae6fd" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
                a = {a}
              </text>
              <text x="0" y="13" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
                a² = {a * a}
              </text>
            </g>

            {/* Unified Clean Badge inside Square B (Orange) */}
            <g transform={`translate(${sbCenter.x}, ${sbCenter.y})`} pointerEvents="none">
              <rect
                x="-38"
                y="-20"
                width="76"
                height="40"
                rx="6"
                fill="#1e0e0a"
                stroke="#fb923c"
                strokeWidth="1.75"
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.75))"
              />
              <text x="0" y="-4" fill="#fed7aa" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
                b = {b}
              </text>
              <text x="0" y="13" fill="#fb923c" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
                b² = {b * b}
              </text>
            </g>

            {/* Unified Clean Badge inside Square C (Gold) */}
            <g transform={`translate(${scCenter.x}, ${scCenter.y})`} pointerEvents="none">
              <rect
                x="-50"
                y="-22"
                width="100"
                height="44"
                rx="7"
                fill="#1c1604"
                stroke="#facc15"
                strokeWidth="2"
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.85))"
              />
              <text x="0" y="-5" fill="#fef08a" fontSize="11.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
                {isNinety ? `c = ${cVal % 1 === 0 ? cVal : cVal.toFixed(1)}` : `c ≈ ${cVal.toFixed(1)}`}
              </text>
              <text x="0" y="14" fill="#facc15" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
                c² = {isNinety ? a * a + b * b : (cVal * cVal).toFixed(1)}
              </text>
            </g>
          </g>
        );
      }

      // -------------------------------------------------------------
      // STATION B & PRACTICE: LADDER RESCUE AGAINST VERTICAL WALL
      // -------------------------------------------------------------
      case 'ladder-wall': {
        const L = data.L || data.c || 13;
        const d = data.d || data.b || 5;
        const h = data.h || data.a || 12;
        const unit = data.unit || 'm';

        const groundY = 205;
        const wallX = 265;
        const wallW = 28;
        const wallTop = 30;

        // Adaptive scaling so ladder fits comfortably
        const maxExpectedH = 26;
        const pxPerUnit = Math.min(150 / Math.max(h, 12), 170 / Math.max(d, 6), 150 / maxExpectedH);

        const currentFootDist = Math.max(d * pxPerUnit, 55);
        const currentReachPx = Math.max(h * pxPerUnit, 50);

        const ladderFootX = Math.max(35, wallX - currentFootDist);
        const ladderTopY = Math.max(wallTop + 10, groundY - currentReachPx);

        // Ladder rungs generation
        const dx = wallX - ladderFootX;
        const dy = ladderTopY - groundY;
        const ladderLengthPx = Math.hypot(dx, dy);
        const rungCount = Math.max(5, Math.min(10, Math.floor(ladderLengthPx / 20)));

        return (
          <g>
            {/* Ground Line with Hatch Texture */}
            <line x1={20} y1={groundY} x2={360} y2={groundY} stroke="#94a3b8" strokeWidth="3.5" />
            {[...Array(16)].map((_, i) => (
              <line
                key={i}
                x1={25 + i * 21}
                y1={groundY}
                x2={17 + i * 21}
                y2={groundY + 10}
                stroke="#475569"
                strokeWidth="1.5"
              />
            ))}

            {/* Vertical Brick Wall */}
            <rect
              x={wallX}
              y={wallTop}
              width={wallW}
              height={groundY - wallTop}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* Wall Brick Lines */}
            {[...Array(7)].map((_, i) => (
              <line
                key={i}
                x1={wallX}
                y1={wallTop + (i + 1) * 22}
                x2={wallX + wallW}
                y2={wallTop + (i + 1) * 22}
                stroke="#334155"
                strokeWidth="1.5"
              />
            ))}
            {/* Wall Top Coping */}
            <rect x={wallX - 4} y={wallTop - 6} width={wallW + 8} height={8} rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Right Angle Square Mark at Corner */}
            <path
              d={`M ${wallX - 16} ${groundY} L ${wallX - 16} ${groundY - 16} L ${wallX} ${groundY - 16}`}
              fill="rgba(255,255,255,0.12)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            {/* Target Window with Glowing Frame */}
            <g transform={`translate(${wallX - 8}, ${ladderTopY - 16})`}>
              {/* Window Backing glow */}
              <rect x={-8} y={-8} width={34} height={42} rx={4} fill="rgba(250,204,21,0.2)" />
              {/* Window Frame */}
              <rect x={-4} y={-4} width={26} height={34} rx={3} fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Panes */}
              <rect x={-1} y={-1} width={9} height={12} fill="#38bdf8" fillOpacity="0.4" />
              <rect x={10} y={-1} width={9} height={12} fill="#38bdf8" fillOpacity="0.4" />
              <rect x={-1} y={13} width={9} height={12} fill="#38bdf8" fillOpacity="0.4" />
              <rect x={10} y={13} width={9} height={12} fill="#38bdf8" fillOpacity="0.4" />
            </g>

            {/* Slanted Ladder with Twin Rails and Rungs */}
            {(() => {
              const nx = (-dy / ladderLengthPx) * 5.5;
              const ny = (dx / ladderLengthPx) * 5.5;

              return (
                <g>
                  {/* Left Rail */}
                  <line
                    x1={ladderFootX - nx}
                    y1={groundY - ny}
                    x2={wallX - nx}
                    y2={ladderTopY - ny}
                    stroke="#facc15"
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                  />
                  {/* Right Rail */}
                  <line
                    x1={ladderFootX + nx}
                    y1={groundY + ny}
                    x2={wallX + nx}
                    y2={ladderTopY + ny}
                    stroke="#facc15"
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                  />
                  {/* Rungs */}
                  {[...Array(rungCount)].map((_, i) => {
                    const t = (i + 1) / (rungCount + 1);
                    const rx = ladderFootX + t * dx;
                    const ry = groundY + t * dy;
                    return (
                      <line
                        key={i}
                        x1={rx - nx}
                        y1={ry - ny}
                        x2={rx + nx}
                        y2={ry + ny}
                        stroke="#fde047"
                        strokeWidth="2.2"
                      />
                    );
                  })}
                </g>
              );
            })()}

            {/* Dimension Pill Badges */}
            {/* Foot Distance d (Cyan) */}
            <LabelPill
              x={(ladderFootX + wallX) / 2}
              y={groundY + 22}
              text={data.unknown === 'b' || data.unknown === 'd' ? 'Foot: d = ?' : `Foot: d = ${d} ${unit}`}
              color="#38bdf8"
              fontSize={13}
            />

            {/* Wall Height h (Orange) */}
            <LabelPill
              x={wallX + wallW + 36}
              y={(groundY + ladderTopY) / 2}
              text={data.unknown === 'a' || data.unknown === 'h' ? 'Height: h = ?' : `Height: h = ${h} ${unit}`}
              color="#fb923c"
              fontSize={13}
            />

            {/* Ladder Length L (Gold Hypotenuse) */}
            <LabelPill
              x={(ladderFootX + wallX) / 2 - 18}
              y={(groundY + ladderTopY) / 2 - 16}
              text={data.unknown === 'c' || data.unknown === 'L' ? 'Ladder: L = ?' : `Ladder: L = ${L} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // STATION C & PRACTICE: ZIP-LINE CABLE MODEL
      // -------------------------------------------------------------
      case 'zipline': {
        const twH = Number(data.towerH) || 20;
        const plH = Number(data.poleH) || 8;
        const gap = Number(data.gap) || 16;
        const length = data.length || 20;

        const groundY = 205;
        const tx = 65;
        const px = 295;

        // Heights
        const towerTopY = 55;
        const poleTopY = 145;

        return (
          <g>
            {/* Ground line */}
            <line x1={25} y1={groundY} x2={355} y2={groundY} stroke="#94a3b8" strokeWidth="3" />

            {/* Left Tower Structure */}
            <rect x={tx - 16} y={towerTopY} width={32} height={groundY - towerTopY} fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <line x1={tx - 16} y1={towerTopY} x2={tx + 16} y2={groundY} stroke="#334155" strokeWidth="1.5" />
            <line x1={tx + 16} y1={towerTopY} x2={tx - 16} y2={groundY} stroke="#334155" strokeWidth="1.5" />
            {/* Tower Observation Platform */}
            <rect x={tx - 22} y={towerTopY - 8} width={44} height={8} rx="2" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Right Pole Structure */}
            <rect x={px - 10} y={poleTopY} width={20} height={groundY - poleTopY} fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <rect x={px - 14} y={poleTopY - 6} width={28} height={6} rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Right Triangle Construction Lines */}
            {/* Horizontal Gap line from pole to tower */}
            <line x1={tx} y1={poleTopY} x2={px} y2={poleTopY} stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 4" />
            {/* Vertical Drop line on tower */}
            <line x1={tx} y1={towerTopY} x2={tx} y2={poleTopY} stroke="#fb923c" strokeWidth="3" strokeDasharray="5 4" />

            {/* Right angle mark at (tx, poleTopY) */}
            <path
              d={`M ${tx + 14} ${poleTopY} L ${tx + 14} ${poleTopY - 14} L ${tx} ${poleTopY - 14}`}
              fill="rgba(255,255,255,0.15)"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Sloping Zip-Line Cable */}
            <line x1={tx} y1={towerTopY} x2={px} y2={poleTopY} stroke="#facc15" strokeWidth={strokeW + 1} strokeLinecap="round" />

            {/* Hanging Pulley Trolley */}
            {(() => {
              const mx = tx + (px - tx) * 0.45;
              const my = towerTopY + (poleTopY - towerTopY) * 0.45;
              return (
                <g transform={`translate(${mx}, ${my})`}>
                  <circle cx={0} cy={0} r={5} fill="#ffffff" stroke="#facc15" strokeWidth={2} />
                  <rect x={-3} y={4} width={6} height={9} rx={1.5} fill="#e2e8f0" />
                </g>
              );
            })()}

            {/* Tower & Pole Height Badges */}
            <LabelPill x={tx} y={towerTopY - 20} text={`Tower: ${twH} m`} color="#94a3b8" fontSize={12} />
            <LabelPill x={px} y={poleTopY - 18} text={`Pole: ${plH} m`} color="#94a3b8" fontSize={12} />

            {/* Triangle Leg & Hypotenuse Badges */}
            <LabelPill x={tx - 44} y={(towerTopY + poleTopY) / 2} text={`Drop: ${twH - plH} m`} color="#fb923c" fontSize={13} />
            <LabelPill x={(tx + px) / 2} y={poleTopY + 18} text={`Gap: ${gap} m`} color="#38bdf8" fontSize={13} />
            <LabelPill x={(tx + px) / 2 + 10} y={(towerTopY + poleTopY) / 2 - 16} text={`Cable: ${length} m`} color="#facc15" fontSize={14} />
          </g>
        );
      }

      // -------------------------------------------------------------
      // RECTANGLE DIAGONAL & FIT-IT BRACING
      // -------------------------------------------------------------
      case 'rect-diagonal': {
        const w = data.w || 60;
        const h = data.h || 80;
        const unit = data.unit || 'cm';
        const rx = 65, ry = 40, rw = 250, rh = 145;

        return (
          <g>
            {/* Rectangle Body */}
            <rect
              x={rx}
              y={ry}
              width={rw}
              height={rh}
              rx={8}
              fill="rgba(129,140,248,0.12)"
              stroke="#818cf8"
              strokeWidth={strokeW}
            />

            {/* Right Angle Corner Mark */}
            <path
              d={`M ${rx + 16} ${ry + rh} L ${rx + 16} ${ry + rh - 16} L ${rx} ${ry + rh - 16}`}
              fill="rgba(255,255,255,0.15)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            {/* Diagonal Line (Hypotenuse) */}
            <line
              x1={rx}
              y1={ry}
              x2={rx + rw}
              y2={ry + rh}
              stroke="#facc15"
              strokeWidth={strokeW + 1}
              strokeDasharray="6 4"
            />

            {/* Badges */}
            <LabelPill x={rx + rw / 2} y={ry + rh + 20} text={`Width: ${w} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={rx - 16} y={ry + rh / 2} text={`Height: ${h} ${unit}`} color="#fb923c" fontSize={13} />
            <LabelPill
              x={rx + rw / 2 + 10}
              y={ry + rh / 2 - 12}
              text={data.unknown === 'c' ? 'Diagonal = ?' : `Diagonal = ${data.c || 'c'} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // RAMP & SLOPE APPLICATION
      // -------------------------------------------------------------
      case 'ramp': {
        const rise = data.rise || data.a || 0.9;
        const run = data.run || data.b || 1.2;
        const length = data.length || data.c || 1.5;
        const unit = data.unit || 'm';

        const ox = 50, oy = 185, rx = 300, topY = 65;

        return (
          <g>
            {/* Ground */}
            <line x1={25} y1={oy} x2={355} y2={oy} stroke="#94a3b8" strokeWidth="3" />

            {/* Ramp Polygon Fill */}
            <polygon
              points={`${ox},${oy} ${rx},${oy} ${rx},${topY}`}
              fill="rgba(56,189,248,0.16)"
              stroke="#38bdf8"
              strokeWidth={strokeW}
            />

            {/* Right Angle at Bottom-Right Corner */}
            <path
              d={`M ${rx - 16} ${oy} L ${rx - 16} ${oy - 16} L ${rx} ${oy - 16}`}
              fill="rgba(255,255,255,0.15)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            {/* Slope Line (Hypotenuse) */}
            <line x1={ox} y1={oy} x2={rx} y2={topY} stroke="#facc15" strokeWidth={strokeW + 1} strokeLinecap="round" />

            {/* Badges */}
            <LabelPill x={(ox + rx) / 2} y={oy + 22} text={`Run: ${run} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={rx + 36} y={(oy + topY) / 2} text={`Rise: ${rise} ${unit}`} color="#fb923c" fontSize={13} />
            <LabelPill
              x={(ox + rx) / 2 - 10}
              y={(oy + topY) / 2 - 16}
              text={data.unknown === 'c' ? 'Slope = ?' : `Slope = ${length} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // ROOF TRUSS RAFTERS
      // -------------------------------------------------------------
      case 'rafter': {
        const halfSpan = data.halfSpan || 12;
        const rise = data.rise || 5;
        const unit = data.unit || 'm';

        const ox = 50, oy = 185, ax = 290, ay = 60;

        return (
          <g>
            {/* Tie Beam (Half-span) */}
            <line x1={ox} y1={oy} x2={ax} y2={oy} stroke="#38bdf8" strokeWidth={strokeW + 0.5} />
            {/* King Post (Rise) */}
            <line x1={ax} y1={oy} x2={ax} y2={ay} stroke="#fb923c" strokeWidth={strokeW + 0.5} />
            {/* Sloping Rafter */}
            <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#facc15" strokeWidth={strokeW + 1.5} strokeLinecap="round" />

            {/* Right Angle at Post Base */}
            <path
              d={`M ${ax - 16} ${oy} L ${ax - 16} ${oy - 16} L ${ax} ${oy - 16}`}
              fill="rgba(255,255,255,0.15)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            <LabelPill x={(ox + ax) / 2} y={oy + 22} text={`Half-span: ${halfSpan} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={ax + 36} y={(oy + ay) / 2} text={`Rise: ${rise} ${unit}`} color="#fb923c" fontSize={13} />
            <LabelPill
              x={(ox + ax) / 2 - 14}
              y={(oy + ay) / 2 - 16}
              text={data.unknown === 'c' ? 'Rafter = ?' : `Rafter = ${data.c || '13'} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // ROUTE COMPARE & SHORTCUT DISPLACEMENT
      // -------------------------------------------------------------
      case 'route-compare':
      case 'grid-displacement': {
        const ox = 60, oy = 180, ex = 285, ey = 180, ny = 55;
        const a = data.a || data.east || 60;
        const b = data.b || data.north || 80;
        const unit = data.unit || 'm';

        return (
          <g>
            {/* Perpendicular path */}
            <path d={`M ${ox} ${oy} L ${ex} ${ey} L ${ex} ${ny}`} fill="none" stroke="#38bdf8" strokeWidth={strokeW} strokeDasharray="6 4" />
            {/* Direct Shortcut / Hypotenuse */}
            <line x1={ox} y1={oy} x2={ex} y2={ny} stroke="#facc15" strokeWidth={strokeW + 1.5} strokeLinecap="round" />

            {/* Corner Right Angle */}
            <path
              d={`M ${ex - 16} ${ey} L ${ex - 16} ${ey - 16} L ${ex} ${ey - 16}`}
              fill="rgba(255,255,255,0.15)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            {/* Markers */}
            <circle cx={ox} cy={oy} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            <circle cx={ex} cy={ny} r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />

            <LabelPill x={(ox + ex) / 2} y={ey + 22} text={`East: ${a} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={ex + 36} y={(ey + ny) / 2} text={`North: ${b} ${unit}`} color="#fb923c" fontSize={13} />
            <LabelPill
              x={(ox + ex) / 2 - 14}
              y={(oy + ny) / 2 - 14}
              text={`Shortcut: ${data.c || 'c'} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // CONVERSE CHECK (NO RIGHT ANGLE SYMBOL)
      // -------------------------------------------------------------
      case 'converse-check': {
        const [s1, s2, s3] = data.sides || [7, 24, 25];
        const unit = data.unit || 'cm';
        const p1 = [55, 175], p2 = [305, 175], p3 = [125, 55];

        return (
          <g>
            <polygon
              points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
              fill="rgba(251,191,36,0.14)"
              stroke="#fbbf24"
              strokeWidth={strokeW}
            />

            <LabelPill x={(p1[0] + p2[0]) / 2} y={p1[1] + 20} text={`Side: ${s2} ${unit}`} color="#ffffff" fontSize={13} />
            <LabelPill x={(p1[0] + p3[0]) / 2 - 16} y={(p1[1] + p3[1]) / 2} text={`Side: ${s1} ${unit}`} color="#ffffff" fontSize={13} />
            <LabelPill x={(p2[0] + p3[0]) / 2 + 16} y={(p2[1] + p3[1]) / 2} text={`Side: ${s3} ${unit}`} color="#ffffff" fontSize={13} />

            {/* Mandatory "Not drawn to scale" banner */}
            <g transform="translate(190, 222)">
              <rect x="-140" y="-12" width="280" height="24" rx="6" fill="#1e1035" stroke="#facc15" strokeWidth="1.5" />
              <text x="0" y="4" fill="#facc15" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="0.04em">
                ⚠️ Not drawn to scale · No right-angle mark
              </text>
            </g>
          </g>
        );
      }

      // -------------------------------------------------------------
      // IDENTIFY SIDES & SCENE EXPLORATION
      // -------------------------------------------------------------
      case 'identify-sides': {
        const a = data.a || 3;
        const b = data.b || 4;
        const c = data.c || 5;
        const unit = data.unit || 'm';

        const ox = 70, oy = 180;
        const legBWidth = 200;
        const legAHeight = 120;

        return (
          <g>
            {/* Triangle fill */}
            <polygon
              points={`${ox},${oy} ${ox + legBWidth},${oy} ${ox},${oy - legAHeight}`}
              fill="rgba(56,189,248,0.14)"
              stroke="#ffffff"
              strokeWidth={strokeW}
            />

            {/* Right Angle Square Mark */}
            <path
              d={`M ${ox + 16} ${oy} L ${ox + 16} ${oy - 16} L ${ox} ${oy - 16}`}
              fill="rgba(255,255,255,0.18)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Glowing Golden Hypotenuse */}
            <line
              x1={ox}
              y1={oy - legAHeight}
              x2={ox + legBWidth}
              y2={oy}
              stroke="#facc15"
              strokeWidth={strokeW + 2}
              strokeLinecap="round"
            />

            {/* Badges */}
            <LabelPill x={ox - 24} y={oy - legAHeight / 2} text={`Leg a = ${a} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={ox + legBWidth / 2} y={oy + 22} text={`Leg b = ${b} ${unit}`} color="#fb923c" fontSize={13} />
            <LabelPill
              x={ox + legBWidth / 2 + 18}
              y={oy - legAHeight / 2 - 14}
              text={`Hypotenuse c = ${c} ${unit}`}
              color="#facc15"
              border="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // FIELD DIAGONAL
      // -------------------------------------------------------------
      case 'field-diagonal': {
        const a = data.a || 60;
        const b = data.b || 80;
        const unit = data.unit || 'm';
        const rx = 55, ry = 40, rw = 250, rh = 145;

        return (
          <g>
            {/* Field */}
            <rect x={rx} y={ry} width={rw} height={rh} rx="10" fill="#132a1e" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="5 4" />

            {/* Corner Right Angle */}
            <path
              d={`M ${rx + 16} ${ry + rh} L ${rx + 16} ${ry + rh - 16} L ${rx} ${ry + rh - 16}`}
              fill="none"
              stroke="#facc15"
              strokeWidth="2.2"
            />

            {/* Shortcut */}
            <line x1={rx} y1={ry} x2={rx + rw} y2={ry + rh} stroke="#facc15" strokeWidth={strokeW + 1.5} strokeLinecap="round" />

            <LabelPill x={rx - 16} y={ry + rh / 2} text={`Width: ${a} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill x={rx + rw / 2} y={ry + rh + 22} text={`Length: ${b} ${unit}`} color="#38bdf8" fontSize={13} />
            <LabelPill
              x={rx + rw / 2 + 10}
              y={ry + rh / 2 - 12}
              text={data.unknown === 'c' ? 'Shortcut = ?' : `Shortcut: ${data.c || 'c'} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }

      // -------------------------------------------------------------
      // STANDARD RIGHT TRIANGLE (DEFAULT)
      // -------------------------------------------------------------
      case 'right-triangle':
      default: {
        const a = data.a || 3;
        const b = data.b || 4;
        const c = data.c || 5;
        const unit = data.unit || 'cm';

        const ox = 70, oy = 185;
        const legBWidth = 210;
        const legAHeight = 125;

        return (
          <g>
            {/* Triangle fill */}
            <polygon
              points={`${ox},${oy} ${ox + legBWidth},${oy} ${ox},${oy - legAHeight}`}
              fill="rgba(56,189,248,0.15)"
              stroke="#ffffff"
              strokeWidth={strokeW}
            />

            {/* Right Angle Square Mark */}
            <path
              d={`M ${ox + 16} ${oy} L ${ox + 16} ${oy - 16} L ${ox} ${oy - 16}`}
              fill="rgba(255,255,255,0.18)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />

            {/* Legs and Hypotenuse */}
            <line x1={ox} y1={oy} x2={ox} y2={oy - legAHeight} stroke="#38bdf8" strokeWidth={strokeW + 0.5} />
            <line x1={ox} y1={oy} x2={ox + legBWidth} y2={oy} stroke="#fb923c" strokeWidth={strokeW + 0.5} />
            <line x1={ox} y1={oy - legAHeight} x2={ox + legBWidth} y2={oy} stroke="#facc15" strokeWidth={strokeW + 1.5} />

            {/* Badges */}
            <LabelPill
              x={ox - 24}
              y={oy - legAHeight / 2}
              text={data.unknown === 'a' ? 'a = ?' : `${a} ${unit}`}
              color="#38bdf8"
              fontSize={13}
            />

            <LabelPill
              x={ox + legBWidth / 2}
              y={oy + 22}
              text={data.unknown === 'b' ? 'b = ?' : `${b} ${unit}`}
              color="#fb923c"
              fontSize={13}
            />

            <LabelPill
              x={ox + legBWidth / 2 + 18}
              y={oy - legAHeight / 2 - 14}
              text={data.unknown === 'c' ? 'c = ?' : `${c} ${unit}`}
              color="#facc15"
              fontSize={14}
            />
          </g>
        );
      }
    }
  };

  return (
    <svg
      viewBox="0 0 380 250"
      className="w-full h-full select-none"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="grad-glow-pyth" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background ambient glow */}
      <circle cx="190" cy="125" r="120" fill="url(#grad-glow-pyth)" pointerEvents="none" />
      {renderContent()}
    </svg>
  );
}
