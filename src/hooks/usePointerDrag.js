import { useRef, useCallback } from 'react';

/**
 * Hook for smooth, robust SVG dragging using pointer capture.
 * Converts client coords into SVG coordinate space via getScreenCTM().inverse().
 */
export function usePointerDrag(svgRef, onDragPoint) {
  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    if (!svgRef.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails in older envs
    }
    isDraggingRef.current = true;
    updatePoint(e);
  }, [svgRef]);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || !svgRef.current) return;
    updatePoint(e);
  }, [svgRef]);

  const handlePointerUp = useCallback((e) => {
    if (!isDraggingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    isDraggingRef.current = false;
  }, []);

  const updatePoint = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(ctm.inverse());
    if (onDragPoint) {
      onDragPoint({ x: transformed.x, y: transformed.y, rawEvent: e });
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp,
    isDraggingRef
  };
}
