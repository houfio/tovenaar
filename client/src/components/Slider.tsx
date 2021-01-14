import styled from '@emotion/styled';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';

type Props<T> = {
  data: T[],
  render: (value: T) => ReactNode,
  width: string
};

export function Slider<T extends { id: string }>({ data, render, width }: Props<T>) {
  const [slide, setSlide] = useState(0);

  return (
    <StyledSlider style={{ width }}>
      {data.map((value) => (
        <StyledSlide key={value.id} slide={slide}>
          {render(value)}
        </StyledSlide>
      ))}
      <StyledLeft disabled={!slide} onClick={() => setSlide(slide - 1)}>
        <FontAwesomeIcon icon={faChevronLeft}/>
      </StyledLeft>
      <StyledRight disabled={slide >= data.length - 1} onClick={() => setSlide(slide + 1)}>
        <FontAwesomeIcon icon={faChevronRight}/>
      </StyledRight>
    </StyledSlider>
  );
}

const StyledSlider = styled.div`
  display: flex;
  position: relative;
  flex-wrap: nowrap;
  border-radius: .5rem;
  overflow: hidden;
`;

const StyledSlide = styled.div<{ slide: number }>`
  display: flex;
  flex: 0 0 100%;
  flex-direction: column;
  transform: translateX(-${(props) => props.slide * 100}%);
  transition: transform .25s ease;
`;

const StyledLeft = styled.button`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: .5rem;
  top: 50%;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--gray-0);
  background-color: var(--gray-500);
  border-radius: 50%;
  outline: none;
  transform: translateY(-50%);
  transition: box-shadow .25s ease, opacity .25s ease;
  &:focus {
    box-shadow: 0 0 0 3px var(--gray-0);
    z-index: 1;
  }
  &:disabled {
    pointer-events: none;
    opacity: .5;
  }
`;

const StyledRight = styled(StyledLeft)`
  left: unset;
  right: .5rem;
`;
