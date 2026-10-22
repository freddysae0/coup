import { PointerEvent, useCallback, useRef, useState } from "react";

const DRAG_THRESHOLD_PX = 4;

/**
 * Lets a mouse pan a horizontal scroller by clicking and dragging, the way a
 * finger already can. Touch and pen keep the browser's native scrolling.
 * Scroll snapping is paused while dragging so it does not fight the pointer.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;

    if (e.pointerType !== "mouse" || e.button !== 0 || !el) return;
    if (el.scrollWidth <= el.clientWidth) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    const d = drag.current;

    if (!el || !d) return;
    const dx = e.clientX - d.x;

    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
      setDragging(true);
    }
    el.scrollLeft = d.left - dx;
  }, []);

  const end = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    const d = drag.current;

    drag.current = null;
    if (!el || !d?.moved) return;
    if (el.hasPointerCapture(e.pointerId))
      el.releasePointerCapture(e.pointerId);
    // Snap back onto the nearest card once the mouse lets go.
    const left = el.scrollLeft;

    el.style.scrollSnapType = "";
    el.scrollLeft = left;
    setDragging(false);
    // The click that ends a drag is not a click on whatever is under it.
    el.addEventListener("click", (ev) => ev.stopPropagation(), {
      capture: true,
      once: true,
    });
  }, []);

  return {
    ref,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      // Stops the browser from dragging the card images out as files.
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
  };
}
