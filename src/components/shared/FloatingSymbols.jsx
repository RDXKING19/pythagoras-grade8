import React from 'react';

export function FloatingSymbols() {
  const symbols = [
    { text: "a² + b² = c²", top: "12%", left: "6%", size: "32px" },
    { text: "√10 000", top: "24%", left: "86%", size: "36px" },
    { text: "3-4-5", top: "72%", left: "8%", size: "36px" },
    { text: "90°", top: "82%", left: "82%", size: "40px" },
    { text: "∟", top: "44%", left: "92%", size: "34px" },
    { text: "c = 100 m", top: "15%", left: "48%", size: "28px" },
    { text: "13² − 5² = 12²", top: "66%", left: "54%", size: "30px" },
    { text: "√73 ≈ 8.5", top: "88%", left: "34%", size: "32px" }
  ];

  return (
    <div className="floating-bg-container" aria-hidden="true">
      {symbols.map((s, idx) => (
        <span
          key={idx}
          className="floating-bg-item"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: `${idx * 2.2}s`
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
