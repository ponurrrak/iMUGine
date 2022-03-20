import React from 'react';
import DOMPurify from 'dompurify';

export const createTextMarkup = text => (
  {__html: DOMPurify.sanitize(text)}
);

export const createSpanMarkup = text => (
  <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
);
