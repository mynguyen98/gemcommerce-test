import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnitValue } from './index';
import { UNITS } from './constants';

describe('UnitValue Component', () => {
  describe('UI Text Rendering', () => {
    it('should render "Unit" label text correctly', () => {
      render(<UnitValue />);
      expect(screen.getByText('Unit')).toBeInTheDocument();
    });

    it('should render "Value" label text correctly', () => {
      render(<UnitValue />);
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('should render "%" button text correctly', () => {
      render(<UnitValue />);
      expect(screen.getByText(UNITS.PERCENT)).toBeInTheDocument();
    });

    it('should render "px" button text correctly', () => {
      render(<UnitValue />);
      expect(screen.getByText(UNITS.PIXEL)).toBeInTheDocument();
    });
  });

  describe('Default values', () => {
    it('should have default value of 0 when no props are provided', () => {
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('0');
    });

    it('should have default unit of % when no props are provided', () => {
      render(<UnitValue />);
      
      const percentButton = screen.getByText(UNITS.PERCENT);
      expect(percentButton).toHaveClass('bg-gray-700 text-gray-50');
    });
  });
  
  describe('Hover behavior', () => {
    it('should apply hover styles to decrement button when hovering over it', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      await user.hover(decrementButton);
      
      expect(decrementButton).toHaveClass('hover:bg-gray-800');
      expect(decrementButton).not.toBeDisabled();
    });

    it('should apply hover styles to increment button when hovering over it', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const incrementButton = buttons[3];
      
      await user.hover(incrementButton);
      
      expect(incrementButton).toHaveClass('hover:bg-gray-800');
      expect(incrementButton).not.toBeDisabled();
    });

    it('should apply hover styles to input when hovering over it', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      
      await user.hover(input);
      
      expect(input).toHaveClass('hover:bg-gray-800');
    });

    it('should have group hover effect when input is hovered', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      const incrementButton = buttons[3];
      
      await user.hover(input);
      
      expect(decrementButton).toHaveClass('group-has-[input:hover]:bg-gray-800');
      expect(incrementButton).toHaveClass('group-has-[input:hover]:bg-gray-800');
    });

    it('should not apply hover styles to disabled decrement button', async () => {
      render(<UnitValue />);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      expect(decrementButton).toBeDisabled();
      
      expect(decrementButton).toHaveClass('pointer-events-none');
    });

    it('should not apply hover styles to disabled increment button when value is 100', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '100');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        
        expect(incrementButton).toBeDisabled();
        
        expect(incrementButton).toHaveClass('pointer-events-none');
      });
    });

    it('should maintain individual button hover when not hovering input', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      await user.hover(decrementButton);
      expect(decrementButton).toHaveClass('hover:bg-gray-800');
      expect(decrementButton).not.toBeDisabled();
    });

    it('should show tooltip when hovering over disabled decrement button at value 0', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      expect(decrementButton).toBeDisabled();
      
      await user.hover(decrementButton);
      
      await waitFor(() => {
        expect(screen.getByText('Value must greater than 0')).toBeInTheDocument();
      });
    });

    it('should show tooltip when hovering over disabled increment button at value 100 in % mode', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '100');
      fireEvent.blur(input);
      
      await waitFor(async () => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        
        expect(incrementButton).toBeDisabled();
        
        await user.hover(incrementButton);
        
        await waitFor(() => {
          expect(screen.getByText('Value must smaller than 100')).toBeInTheDocument();
        });
      });
    });

    it('should not show tooltip when hovering over enabled decrement button', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      expect(decrementButton).not.toBeDisabled();
      
      await user.hover(decrementButton);
      
      expect(screen.queryByText('Value must greater than 0')).not.toBeInTheDocument();
    });

    it('should not show tooltip when hovering over enabled increment button', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const incrementButton = buttons[3];
      
      expect(incrementButton).not.toBeDisabled();
      
      await user.hover(incrementButton);
      
      expect(screen.queryByText('Value must smaller than 100')).not.toBeInTheDocument();
    });

    it('should not show tooltip for increment button in px mode even with large values', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '1000');
      fireEvent.blur(input);
      
      const buttons = screen.getAllByRole('button');
      const incrementButton = buttons[3];
      
      expect(incrementButton).not.toBeDisabled();
      
      await user.hover(incrementButton);
      
      expect(screen.queryByText('Value must smaller than 100')).not.toBeInTheDocument();
    });
  });

  describe('Input validation - Integer and Float values', () => {
    it('should allow integer input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, '12');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 12, unit: UNITS.PERCENT });
      });
    });

    it('should allow float input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '12.5');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 12.5, unit: UNITS.PERCENT });
      });
    });
  });

  describe('Input validation - Comma to dot conversion', () => {
    it('should replace comma with dot: 12,3 -> 12.3', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '12,3');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 12.3, unit: UNITS.PERCENT });
      });
    });
  });

  describe('Input validation - Invalid characters removal', () => {
    it('should convert 123a to 123 on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      onChange.mockClear();
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, '123a');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 123, unit: UNITS.PIXEL });
      });
    });

    it('should convert 12a3 to 12 on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      await user.click(input);
      await user.clear(input);
      await user.type(input, '12a3');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 12, unit: UNITS.PERCENT });
      });
    });

    it('should revert to previous valid value when input starts with invalid character (a123)', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      await user.click(input);
      await user.clear(input);
      await user.type(input, 'a123');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 50, unit: UNITS.PERCENT });
      });
    });

    it('should revert to previous valid value when input has multiple dots (12.4.5)', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      await user.click(input);
      await user.clear(input);
      await user.type(input, '12.4.5');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 50, unit: UNITS.PERCENT });
      });
    });
  });

  describe('Input validation - Negative values', () => {
    it('should convert negative value to 0 on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '10');
      fireEvent.blur(input);
      onChange.mockClear();
      
      await user.click(input);
      await user.clear(input);
      await user.type(input, '-5');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 0, unit: UNITS.PERCENT });
      });
    });
  });

  describe('Percent unit (%) validation', () => {
    it('should revert to previous value when input > 100 on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      await user.click(input);
      await user.clear(input);
      await user.type(input, '150');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 50, unit: UNITS.PERCENT });
      });
    });

    it('should disable "-" button when value is 0', () => {
      render(<UnitValue />);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      expect(decrementButton).toBeDisabled();
    });

    it('should disable "+" button when value is 100', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      // Set value to 100
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '100');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        expect(incrementButton).toBeDisabled();
      });
    });

    it('should not disable "-" button when value > 0', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      // Set value to 50
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const decrementButton = buttons[2];
        expect(decrementButton).not.toBeDisabled();
      });
    });

    it('should not disable "+" button when value < 100', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        expect(incrementButton).not.toBeDisabled();
      });
    });
  });

  describe('Pixel unit (px) validation', () => {
    it('should allow values > 100 for px unit', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      onChange.mockClear();
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '500');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 500, unit: UNITS.PIXEL });
      });
    });

    it('should not disable "+" button for px unit even with large values', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '1000');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        expect(incrementButton).not.toBeDisabled();
      });
    });

    it('should disable "-" button when value is 0 for px unit', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const decrementButton = buttons[2];
        expect(decrementButton).toBeDisabled();
      });
    });
  });

  describe('Unit switching behavior', () => {
    it('should update value to 100 when switching from px to % with value > 100', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      onChange.mockClear();
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '500');
      fireEvent.blur(input);
      onChange.mockClear();
      
      const percentButton = screen.getByText(UNITS.PERCENT);
      await user.click(percentButton);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 100, unit: UNITS.PERCENT });
      });
    });

    it('should not change value when switching from px to % with value <= 100', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      onChange.mockClear();
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      const percentButton = screen.getByText(UNITS.PERCENT);
      await user.click(percentButton);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 50, unit: UNITS.PERCENT });
      });
    });
  });

  describe('Increment/Decrement buttons', () => {
    it('should increment value by step when "+" button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      const buttons = screen.getAllByRole('button');
      const incrementButton = buttons[3];
      await user.click(incrementButton);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 51, unit: UNITS.PERCENT });
      });
    });

    it('should decrement value by step when "-" button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '50');
      fireEvent.blur(input);
      onChange.mockClear();
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      await user.click(decrementButton);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 49, unit: UNITS.PERCENT });
      });
    });

    it('should not exceed 100 when incrementing in % mode', async () => {
      const user = userEvent.setup();
      render(<UnitValue />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '100');
      fireEvent.blur(input);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[3];
        expect(incrementButton).toBeDisabled();
      });
    });

    it('should not go below 0 when decrementing', () => {
      render(<UnitValue />);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[2];
      
      expect(decrementButton).toBeDisabled();
    });
  });
  describe('onChange callback', () => {
    it('should call onChange with correct data structure', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '75');
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            value: expect.any(Number),
            unit: expect.any(String)
          })
        );
      });
    });

    it('should call onChange when unit is switched', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<UnitValue onChange={onChange} />);
      
      const pxButton = screen.getByText(UNITS.PIXEL);
      await user.click(pxButton);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ value: 0, unit: UNITS.PIXEL });
      });
    });
  });
});
