import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string
};

export function FileInput(props: Props & ComponentPropsWithoutRef<'input'>) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState<string>();
  const form = useFormContext();

  const { isSubmitting } = form?.formState ?? {};
  const setFile = (files: FileList | null) => {
    const file = files?.[0];

    if (!ref.current || !file) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
    form?.setValue(props.name, file, {
      shouldDirty: true
    });
    ref.current.value = '';
  }

  return (
    <StyledDrop
      over={over}
      preview={preview}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(event.dataTransfer.types.some((t) => t === 'Files'));
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        if (!over) {
          return;
        }

        event.preventDefault();
        setOver(false);
        setFile(event.dataTransfer.files);
      }}
      onClick={() => ref.current?.click()}
    >
      <StyledInput
        ref={ref}
        type="file"
        readOnly={isSubmitting}
        onChange={(event) => setFile(event.target.files)}
        {...props}
      />
      <StyledLabel over={over} preview={preview !== undefined}>
        Drop a file or click here
      </StyledLabel>
    </StyledDrop>
  );
}

const StyledDrop = styled.button<{ over: boolean, preview?: string }>`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 8rem 0;
  background-color: var(--gray-100);
  border-radius: .5rem;
  outline: none;
  overflow: hidden;
  transition: background-color .25s ease, background-image .25s ease, box-shadow .25s ease, opacity .25s ease;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 3px var(--gray-500);
    z-index: 1;
  }
  ${(props) => props.over && css`
    background-color: var(--gray-200);
  `};
  ${(props) => props.preview && css`
    background: url("${props.preview}") center no-repeat;
    background-size: cover;
  `};
`;

const StyledInput = styled.input`
  display: none;
`;

const StyledLabel = styled.span<{ over: boolean, preview: boolean }>`
  padding: .75rem 1rem;
  background-color: var(--gray-100);
  border-radius: .5rem;
  transform-origin: center center;
  pointer-events: none;
  ${(props) => props.over && css`
    animation: shake-slow 2.5s ease-in-out infinite;
  `};
  ${(props) => props.preview && css`
    box-shadow: 0 0 4rem var(--gray-300);
  `};
`;
