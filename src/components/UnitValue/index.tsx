import React, { useState } from 'react';
import { UnitToggle, UnitInput } from './components';
import { Unit } from './types';
import { UNITS, PERCENT_MAX } from './constants';

export interface UnitValueProps {
  onChange?: (data: { value: number; unit: Unit }) => void;
  disabled?: boolean;
}


export const UnitValue: React.FC<UnitValueProps> = ({
  onChange,
}) => {
  const [value, setValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(UNITS.PERCENT);

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange({ value: newValue, unit: selectedUnit });
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit === selectedUnit) {
      return;
    }
    
    setSelectedUnit(newUnit);
    
    let finalValue = value;
    if (newUnit === UNITS.PERCENT && value > PERCENT_MAX) {
      finalValue = PERCENT_MAX;
      setValue(PERCENT_MAX);
    }
    
    if (onChange) {
      onChange({ value: finalValue, unit: newUnit });
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 w-fit bg-gray-950">
      <UnitToggle
        selectedUnit={selectedUnit}
        onUnitChange={handleUnitChange}
      />
      <UnitInput
        value={value}
        onChange={handleValueChange}
        unit={selectedUnit}
      />
    </div>
  );
};

export default UnitValue;
