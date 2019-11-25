import { Dict } from '@mohism/utils';

const TAGS_TO_FIX: Dict<string> = {
  '&quot;': '"',
  '&#39;': '\'',
};

export const trim = (str: string): string => {
  return str.replace(/^\s*/, '');
};

export const fix = (str: string): string => {
  for (const t in TAGS_TO_FIX) {
    str = str.replace(new RegExp(t, 'g'), TAGS_TO_FIX[t]);
  }
  return str;
};
