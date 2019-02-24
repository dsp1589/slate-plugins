import React from 'react';

import Gallery from './Gallery';
import ReadOnlyGallery from './readOnly/Gallery';
import { GalleryOptions } from './types';
import { handleChange } from './utils';

const galleryPlugin = (options = {} as GalleryOptions) => ({
  onChange(editor, next) {
    return handleChange(editor, next);
  },

  renderNode(props, editor, next) {
    switch (props.node.type) {
      case 'gallery': {
        if (props.readOnly) {
          return <ReadOnlyGallery editor={editor} {...props} {...options} />;
        }
        return <Gallery editor={editor} {...props} {...options} />;
      }
      default:
        return next();
    }
  },

  schema: {
    blocks: {
      gallery: {
        isVoid: true,
      },
    },
  },
});

export { Gallery, galleryPlugin };
