import { renderHook, act } from '@testing-library/react';
import useMenuHighlight from './useMenuHighlight';

const UPDATE_HOUR = 14; // 2 PM

describe('useMenuHighlight', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the correct highlight text based on the current time', () => {
    const mockDate = new Date(2023, 5, 1, 10, 0, 0); // June 1, 2023, 10:00 AM
    jest.setSystemTime(mockDate);

    const { result } = renderHook(() => useMenuHighlight());

    expect(result.current).toBe('donnerstag mittag');
  });

  it('should update the highlight text after UPDATE_HOUR', () => {
    const mockDate = new Date(2023, 5, 1, UPDATE_HOUR - 1, 59, 59); // June 1, 2023, 3:59:59 PM
    jest.setSystemTime(mockDate);

    const { result } = renderHook(() => useMenuHighlight());
    expect(result.current).toBe('donnerstag mittag');

    act(() => {
      jest.advanceTimersByTime(2000); // Advance to 4:00:01 PM
    });

    expect(result.current).toBe('donnerstag abend');
  });

  it('should update the highlight text at midnight', () => {
    const mockDate = new Date(2023, 5, 1, 23, 59, 59); // June 1, 2023, 11:59:59 PM
    jest.setSystemTime(mockDate);

    const { result } = renderHook(() => useMenuHighlight());
    expect(result.current).toBe('donnerstag abend');

    act(() => {
      jest.advanceTimersByTime(2000); // Advance to 12:00:01 AM (next day)
    });

    expect(result.current).toBe('freitag mittag');
  });

  it('should handle crossing midnight correctly', () => {
    const mockDate = new Date(2023, 5, 1, 23, 0, 0); // June 1, 2023, 11:00 PM
    jest.setSystemTime(mockDate);

    const { result } = renderHook(() => useMenuHighlight());
    expect(result.current).toBe('donnerstag abend');

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000); // Advance 2 hours to 1:00 AM
    });

    expect(result.current).toBe('freitag mittag');
  });

  it('should handle time between UPDATE_HOUR and midnight correctly', () => {
    const mockDate = new Date(2023, 5, 1, 18, 0, 0); // June 1, 2023, 6:00 PM (after UPDATE_HOUR)
    jest.setSystemTime(mockDate);

    const { result } = renderHook(() => useMenuHighlight());
    expect(result.current).toBe('donnerstag abend');

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 60 * 1000); // Advance 5 hours to 11:00 PM
    });

    expect(result.current).toBe('donnerstag abend');

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000); // Advance 2 more hours to 1:00 AM next day
    });

    expect(result.current).toBe('freitag mittag');
  });
});