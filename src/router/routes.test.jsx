// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('簡單的測試', () => {
  it('畫一個 <h1>', () => {
    render(<h1>標題</h1>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
