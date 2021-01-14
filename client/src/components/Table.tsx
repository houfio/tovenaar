import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { forBreakpoint } from '../utils/forBreakpoint';

import { Spinner } from './Spinner';

type Props<T> = {
  data: T[],
  columns: { [K in keyof T]?: Column<T, K> },
  loading?: boolean,
  onClick?: (data: T) => void
};

type Column<T, K extends keyof T> = {
  label: string,
  format?: (value: T[K], data: T) => ReactNode
};

export function Table<T extends { id: string }>({ data, columns, loading, onClick }: Props<T>) {
  return (
    <StyledTable>
      <StyledHead>
        <StyledRow>
          {Object.entries(columns).map(([key, { label }]) => (
            <StyledHeading key={key}>
              {label}
            </StyledHeading>
          ))}
        </StyledRow>
      </StyledHead>
      <tbody>
        {loading || !data.length ? (
          <StyledRow>
            <StyledPlaceholder colSpan={Object.keys(columns).length}>
              {loading ? (
                <StyledSpinner/>
              ) : 'No results'}
            </StyledPlaceholder>
          </StyledRow>
        ) : data.map((d) => (
          <StyledRow
            key={d.id}
            tabIndex={0}
            onClick={() => onClick?.(d)}
            onKeyDown={(e) => (e.code === 'Enter' || e.code === 'Space') && onClick?.(d)}
          >
            {Object.entries(columns).map(([key, { label, format }]) => {
              const value = d[key as keyof T];

              return (
                <StyledData key={key} data-label={label}>
                  {format?.(value) ?? value}
                </StyledData>
              );
            })}
          </StyledRow>
        ))}
      </tbody>
    </StyledTable>
  )
}

const StyledTable = styled.table`
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 1rem;
  overflow: hidden;
`;

const StyledHead = styled.thead`
  display: none;
  ${forBreakpoint('tabletLandscape', css`
    display: table-header-group;
  `)};
`;

const StyledRow = styled.tr`
  display: block;
  background-color: var(--gray-200);
  border-radius: 1rem;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  ${forBreakpoint('tabletLandscape', css`
    display: table-row;
    border-radius: 0;
    &:first-child > th {
      padding-top: 1.25rem;
    }
    &:last-child {
      border-radius: 0 0 1rem 1rem;
      & > td {
        padding-bottom: 1.25rem;
      }
    }
  `)};
  &[tabindex] {
    outline: none;
    transition: background-color .25s ease, box-shadow .25s ease;
    &:hover {
      background-color: var(--gray-300);
      cursor: pointer;
    }
    &:focus {
      box-shadow: 0 0 0 3px inset var(--gray-500);
    }
  }
`;

const StyledHeading = styled.th`
  padding: .75rem 1.25rem;
  font-weight: bold;
  text-align: left;
  &:first-child {
    padding-top: 1.25rem;
    ${forBreakpoint('tabletLandscape', css`
      padding-top: 0;
    `)};
  }
  &:last-child {
    padding-bottom: 1.25rem;
    ${forBreakpoint('tabletLandscape', css`
      padding-bottom: 0;
    `)};
  }
`;

const StyledPlaceholder = styled.td`
  display: block;
  padding: 2rem;
  text-align: center;
  ${forBreakpoint('tabletLandscape', css`
    display: table-cell;
    padding: 1.25rem;
  `)};
`;

const StyledSpinner = styled(Spinner)`
  margin: 0 auto;
`;

const StyledData = styled(StyledHeading.withComponent('td'))`
  display: block;
  font-weight: normal;
  &::before {
    content: attr(data-label);
    display: block;
    margin-bottom: .5rem;
    font-weight: bold;
    ${forBreakpoint('tabletLandscape', css`
      display: none;
    `)};
  }
  ${forBreakpoint('tabletLandscape', css`
    display: table-cell;
  `)};
`;
