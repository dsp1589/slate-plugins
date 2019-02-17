import React from 'react';
import { useUIDSeed } from 'react-uid';

import Image from './Image';
import { RenderControlsArgs, RenderImageArgs, TypeImage } from './types';
import { container, getItemStyle } from './utils';

interface GridProps {
  images?: TypeImage[];
  size: number;
  renderControls?: (args: RenderControlsArgs) => React.ReactNode;
  renderImage?: (args: RenderImageArgs) => React.ReactNode;
  readOnly: boolean;
  onOpenEditModal?: (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  imageWrapperClassName?: string;
  imageClassName?: string;
  leftClassName?: string;
}

const Grid: React.FunctionComponent<GridProps> = props => {
  const seed = useUIDSeed();

  const { images, size, ...rest } = props;
  const length = images.length || 1;
  const fixedSize =
    typeof size === 'number' && size > 0 && size <= 9 ? size : 9;
  const maxLength = length > fixedSize ? fixedSize : length;
  // number of images that was left
  const left = length - maxLength;

  return (
    <>
      <div style={container(maxLength)}>
        {images.map((image, index) => {
          const key = seed(image) as string;
          const withLeft = Boolean(index === maxLength - 1 && left > 0);
          const wrapperStyle = {
            ...getItemStyle(index, maxLength),
            position: 'relative',
          } as React.CSSProperties;

          return (
            <Image
              key={key}
              index={index}
              image={image}
              wrapperStyle={wrapperStyle}
              withLeft={withLeft}
              left={left}
              {...rest}
            />
          );
        })}
      </div>
    </>
  );
};

export default Grid;
