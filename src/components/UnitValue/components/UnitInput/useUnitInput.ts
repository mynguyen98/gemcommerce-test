import { useState, useEffect } from 'react';
import { Unit } from '../../types';
import { DEFAULT_MIN, DEFAULT_STEP, PERCENT_MAX, UNITS } from '../../constants';

interface UseUnitInputProps {
  value: number;
  onChange: (value: number) => void;
  unit: Unit;
  min?: number;
  step?: number;
}

export const useUnitInput = ({
  value,
  onChange,
  unit,
  min = DEFAULT_MIN,
  step = DEFAULT_STEP,
}: UseUnitInputProps) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [previousValidValue, setPreviousValidValue] = useState(value);

  // Sync localValue when value prop changes externally
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
      setPreviousValidValue(value);
    }
  }, [value, isFocused]);

  // Clean and parse input value
  const parseInputValue = (input: string): number | null => {
    if (!input.trim()) return null;

    // Replace comma with dot and extract valid number pattern
    const cleaned = input.replace(',', '.').match(/^-?\d*\.?\d*/)?.[0] || '';
    
    // Check for invalid patterns
    if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned.endsWith('.')) {
      return null;
    }

    const numValue = Number(cleaned);
    return isNaN(numValue) ? null : numValue;
    };

  const updateValue = (delta: number) => {
    let newValue = value + delta;
    if (unit === UNITS.PERCENT) newValue = Math.min(newValue, PERCENT_MAX);
    newValue = Math.max(newValue, min);
    onChange(newValue);
    setLocalValue(newValue.toString());
    setPreviousValidValue(newValue);
  };

  const handleIncrement = () => updateValue(step);
  const handleDecrement = () => updateValue(-step);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    
    const parsedValue = parseInputValue(localValue);
    
    if (parsedValue === null) {
      setLocalValue(previousValidValue.toString());
      onChange(previousValidValue);
    } else {
      let finalValue = parsedValue;
      
      // validation rules
      if (finalValue < DEFAULT_MIN) {
        finalValue = DEFAULT_MIN;
      } 
      else if (unit === UNITS.PERCENT && finalValue > PERCENT_MAX) {
        finalValue = previousValidValue;
      }
      
      setLocalValue(finalValue.toString());
      onChange(finalValue);
      setPreviousValidValue(finalValue);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  // Check if buttons should be disabled
  const isDecrementDisabled =  value <= DEFAULT_MIN;
  const isIncrementDisabled = (unit === UNITS.PERCENT && value >= PERCENT_MAX);

  return {
    localValue,
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    isDecrementDisabled,
    isIncrementDisabled,
  };
};
