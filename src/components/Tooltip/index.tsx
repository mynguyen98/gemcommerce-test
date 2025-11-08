import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  content: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export default function Tooltip({ content, className, children }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showBelow, setShowBelow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if ((show || isHoveringTooltip) && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const spaceAbove = triggerRect.top;
      const shouldShowBelow = spaceAbove < tooltipRect.height + 12;
      setShowBelow(shouldShowBelow);

      const tooltipTop = shouldShowBelow
        ? triggerRect.bottom + scrollY + 12
        : triggerRect.top + scrollY - tooltipRect.height - 12;

      const tooltipLeft = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;

      setPosition({
        top: tooltipTop,
        left: tooltipLeft,
      });
    }
  }, [show, isHoveringTooltip]);

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    if (!isHoveringTooltip) {
      setShow(false);
    }
  };

  const handleTooltipMouseEnter = () => {
    setIsHoveringTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsHoveringTooltip(false);
    setShow(false);
  };

  const isVisible = show || isHoveringTooltip;

  return (
    <>
      <div
        ref={triggerRef}
        className="relative flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            className={`z-[9999] flex flex-col transition-opacity duration-200 ${
              isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            } ${className || ""}`}
          >
            <div
              className="absolute w-full"
              style={{
                height: "8px",
                top: showBelow ? "-12px" : "100%",
              }}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            />

            <div
              className="text-xs text-gray-50 leading-[20px] relative rounded-corner-400 bg-gray-900 px-2 py-1 text-center  font-normal opacity-100"
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            >
              {content}
              <div
                className={`absolute left-1/2 h-0 w-0 -translate-x-1/2 ${
                  showBelow
                    ? "top-0 -translate-y-full border-r-[4px] border-b-[4px] border-l-[4px] border-r-transparent border-b-gray-900 border-l-transparent"
                    : "bottom-0 translate-y-full border-t-[4px] border-r-[4px] border-l-[4px] border-t-gray-900 border-r-transparent border-l-transparent"
                }`}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
