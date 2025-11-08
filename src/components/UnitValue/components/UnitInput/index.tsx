import React from 'react';
import Tooltip from '../../../Tooltip';
import { useUnitInput } from './useUnitInput';
import { Unit } from '../../types';
import { DEFAULT_MIN, DEFAULT_STEP } from '../../constants';

interface UnitInputProps  {
  value: number;
  onChange: (value: number) => void;
  unit: Unit;
  min?: number;
  step?: number;
}

interface IconButtonProps {
  icon: 'plus' | 'minus';
  onClick: () => void;
  disabled: boolean;
  tooltipContent?: string;
  position?: 'left' | 'right';
  className?: string;
}

const TOOLTIP_MESSAGES = {
  MIN_VALUE: 'Value must greater than 0',
  MAX_PERCENT: 'Value must smaller than 100',
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  onClick, 
  disabled, 
  tooltipContent,
  position = 'left',
  className = '',
}) => {
  const iconPath = `/assets/icons/ic_${icon}.svg`;
  const roundedClass = position === 'left' ? 'rounded-l-corner-400' : 'rounded-r-corner-400';
  
  const buttonElement = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-9 h-9 ${className} ${roundedClass} flex items-center justify-center
        transition-colors duration-150 bg-gray-900
        group-has-[input:hover]:bg-gray-800
        ${disabled 
          ? 'opacity-50 !bg-gray-900 pointer-events-none' 
          : 'hover:bg-gray-800 active:bg-gray-800 cursor-pointer'
        }
      `}
    >
      <div 
        className={`w-3 h-3 ${disabled ? 'bg-gray-400' : 'bg-gray-50'}`}
        style={{
          maskImage: `url(${iconPath})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${iconPath})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      />
    </button>
  );

  return disabled && tooltipContent ? (
    <Tooltip content={tooltipContent}>{buttonElement}</Tooltip>
  ) : (
    buttonElement
  );
};

export const UnitInput: React.FC<UnitInputProps> = ({
  value,
  onChange,
  unit,
  min = DEFAULT_MIN,
  step = DEFAULT_STEP,
}) => {
  const {
    localValue,
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    isDecrementDisabled,
    isIncrementDisabled,
  } = useUnitInput({ value, onChange, unit, min, step });
  console.log('UnitInput rendered with value:', value, 'localValue:', localValue);
  return (
    <div className="flex w-62 items-center justify-between gap-1">
      <p className="flex-1 text-xs text-gray-400 font-normal w-16">Value</p>
      <div
        className='group flex w-35 h-9 bg-gray-900 items-center focus-within:outline rounded-corner-400 focus-within:outline-blue-500'
      >
        <IconButton
          icon="minus"
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          tooltipContent={TOOLTIP_MESSAGES.MIN_VALUE}
          position="left"
          className='group/minus'
        />
        <div className="flex-1 min-w-0 h-full">
          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className='w-full h-full bg-gray-900 hover:bg-gray-800 text-gray-50 text-center text-xs
              border-none outline-none 
              transition-colors duration-150
            '
          />
        </div>
        <IconButton
          icon="plus"
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          tooltipContent={TOOLTIP_MESSAGES.MAX_PERCENT}
          position="right"
          className='group/plus'
        />
      </div>
    </div>
  );
};

export default UnitInput;
