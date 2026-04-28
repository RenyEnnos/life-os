// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HealthFilters } from '../components/HealthFilters';

const renderWithRouter = (initialEntries: string[] = ['/health']) =>
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <HealthFilters />
        </MemoryRouter>
    );

describe('HealthFilters', () => {
    it('renders metric type dropdown', () => {
        renderWithRouter();
        expect(screen.getByText('Metric Type')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders date inputs', () => {
        renderWithRouter();
        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
    });

    it('renders tags input', () => {
        renderWithRouter();
        expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('renders Filter button', () => {
        renderWithRouter();
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('renders all metric type options', () => {
        renderWithRouter();
        const options = screen.getAllByRole('option');
        expect(options.length).toBe(7);
    });
});
