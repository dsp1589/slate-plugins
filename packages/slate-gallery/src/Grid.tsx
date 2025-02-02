import { useCallback, useMemo } from 'react';
import arrayMove from 'array-move';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
} from 'react-sortable-hoc';
import { useUIDSeed } from 'react-uid';
import { Element } from 'slate';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import Image from './Image';
import {
  ReactEditorExtended,
  RenderControlsArgs,
  RenderImageArgs,
  TypeImage,
} from './types';
import { changeNodeData, container, getItemStyle } from './utils';

interface GridProps {
  editor: ReactEditorExtended;
  element: Element;
  images?: TypeImage[];
  size: number;
  renderControls?: (args: RenderControlsArgs) => ReactNode;
  renderImage?: (args: RenderImageArgs) => ReactNode;
  readOnly: boolean;
  onOpenEditModal?: (e: MouseEvent<HTMLButtonElement>, index: number) => void;
  onRemove?: (e: MouseEvent<HTMLButtonElement>, index: number) => void;
  imageWrapperClassName?: string;
  imageClassName?: string;
  leftClassName?: string;
  sortableContainerProps: SortableContainerProps;
}

interface SortableListProps extends SortableContainerProps {
  images?: TypeImage[];
  left?: number;
  maxLength: number;
  seed: (item) => string;
  readOnly: boolean;
}

interface SortableItemProps extends SortableElementProps {
  image: TypeImage;
  imageIndex: number;
  left?: number;
  withLeft: boolean;
  wrapperStyle: CSSProperties;
  readOnly: boolean;
}

const SortableItem = SortableElement(
  ({
    image,
    imageIndex,
    wrapperStyle,
    withLeft,
    left,
    ...rest
  }: SortableItemProps) => (
    <Image
      index={imageIndex}
      image={image}
      wrapperStyle={wrapperStyle}
      withLeft={withLeft}
      left={left}
      {...rest}
    />
  ),
);

const SortableList = SortableContainer((props: SortableListProps) => {
  const { images, left, maxLength, seed, ...rest } = props;
  return (
    <div style={container(maxLength)}>
      {images.map((image, index) => {
        const key = seed(image) as string;
        const withLeft = Boolean(index === maxLength - 1 && left > 0);
        const wrapperStyle = {
          ...getItemStyle(index, maxLength),
          position: 'relative',
        } as CSSProperties;

        return (
          <SortableItem
            key={key}
            // internally used index prop
            index={index}
            imageIndex={index}
            image={image}
            wrapperStyle={wrapperStyle}
            withLeft={withLeft}
            left={left}
            {...rest}
          />
        );
      })}
    </div>
  );
});

const Grid = ({
  editor,
  element,
  images,
  size,
  sortableContainerProps,
  ...rest
}: GridProps) => {
  const seed = useUIDSeed();

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      changeNodeData(editor, element, {
        images: arrayMove(images, oldIndex, newIndex),
      });
    },
    [element, images],
  );

  const shouldCancelStart = useCallback(() => false, []);

  const length = images.length || 1;
  const fixedSize = useMemo(
    () => (typeof size === 'number' && size > 0 && size <= 9 ? size : 9),
    [size],
  );
  const maxLength = length > fixedSize ? fixedSize : length;
  // number of images that was left
  const left = length - maxLength;

  return (
    <SortableList
      axis="xy"
      images={images}
      left={left}
      maxLength={maxLength}
      onSortEnd={onSortEnd}
      shouldCancelStart={shouldCancelStart}
      seed={seed}
      {...rest}
      {...sortableContainerProps}
    />
  );
};

export default Grid;
