import { capitalize, slugify, stripHTML } from '../../../utils/string';

describe('utils/string', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should return non-string values unchanged', () => {
      expect(capitalize(123)).toBe(123);
      expect(capitalize(null)).toBe(null);
      expect(capitalize(undefined)).toBe(undefined);
    });

    it('should capitalize only first letter', () => {
      expect(capitalize('hELLO WORLD')).toBe('HELLO WORLD');
    });
  });

  describe('slugify', () => {
    it('should convert string to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('multiple   spaces   here')).toBe('multiple-spaces-here');
    });

    it('should replace & with and', () => {
      expect(slugify('salt & pepper')).toBe('salt-and-pepper');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! World?')).toBe('hello-world');
    });

    it('should handle accented characters', () => {
      // The function removes accented characters but doesn't normalize them
      expect(slugify('café résumé')).toBe('caf-rsum');
    });

    it('should trim whitespace', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    it('should collapse multiple hyphens', () => {
      expect(slugify('hello---world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(slugify('item 1 and item 2')).toBe('item-1-and-item-2');
    });
  });

  describe('stripHTML', () => {
    it('should remove HTML tags from string', () => {
      expect(stripHTML('<p>Hello World</p>')).toBe('Hello World');
    });

    it('should handle nested tags', () => {
      expect(stripHTML('<div><p><strong>Bold</strong> text</p></div>')).toBe('Bold text');
    });

    it('should return string without HTML tags unchanged', () => {
      expect(stripHTML('plain text')).toBe('plain text');
    });

    it('should handle empty tags', () => {
      // stripHTML only processes strings containing both < and >
      // If no text content, returns original
      expect(stripHTML('<div></div>')).toBe('<div></div>');
    });

    it('should handle self-closing tags', () => {
      expect(stripHTML('Line 1<br/>Line 2')).toBe('Line 1Line 2');
    });

    it('should handle strings with only > or <', () => {
      expect(stripHTML('5 > 3')).toBe('5 > 3');
      expect(stripHTML('3 < 5')).toBe('3 < 5');
    });

    it('should handle HTML entities', () => {
      expect(stripHTML('<p>&amp; &lt; &gt;</p>')).toBe('& < >');
    });
  });
});
