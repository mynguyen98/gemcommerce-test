import React from 'react';
import { Unit } from '../../types';
import { UNITS } from '../../constants';

interface UnitToggleProps  {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
}

const UNIT_OPTIONS: Unit[] = [UNITS.PERCENT, UNITS.PIXEL];

export const UnitToggle: React.FC<UnitToggleProps> = ({
  selectedUnit,
  onUnitChange,
}) => {
  return (
    <div className="flex w-62 items-center justify-between gap-1">
      <p className="flex-1 text-xs text-gray-400 font-normal w-16">Unit</p>
      <div className="flex w-35 h-9 gap-0.5 p-0.5 rounded-corner-400 bg-gray-900">
        {UNIT_OPTIONS.map((unit) => (
          <button
            key={unit}
            onClick={() => onUnitChange(unit)}
            className={`
              flex-1 h-8 rounded-corner-300 text-xs font-medium cursor-pointer transition-colors duration-150
              ${
                selectedUnit === unit
                  ? 'bg-gray-700 text-gray-50'
                  : 'text-gray-400'
              }
            `}
          >
            {unit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UnitToggle;
