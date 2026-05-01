import {
  roundPositionValues,
  getCorrectDroppedOffsetValue,
  getStyles,
  isSelectedItem,
  findItemById,
  moveItemInArrayFromIndexToIndex,
  findItemsOnPage,
  collisionCheck,
  getFileName,
  arrayMove,
  normalizeHexColor,
  isValidHexColor,
  isItemInSelectionBox,
  getItemsInSelectionBox,
  getDimensions,
  calculateGuidePositions,
  getTabsWithElements,
  emptyFunction,
} from '../../../utils/functions';

describe('utils/functions', () => {
  describe('roundPositionValues', () => {
    it('should round height, left, top, width to integers', () => {
      const input = {
        height: 100.7,
        left: 50.3,
        top: 25.9,
        width: 200.1,
      };
      const result = roundPositionValues(input);
      expect(result).toEqual({
        height: 101,
        left: 50,
        top: 26,
        width: 200,
      });
    });

    it('should preserve other properties', () => {
      const input = {
        height: 100.5,
        id: 'test-id',
        left: 50.5,
        name: 'test',
      };
      const result = roundPositionValues(input);
      expect(result.id).toBe('test-id');
      expect(result.name).toBe('test');
    });

    it('should handle undefined values', () => {
      const input = { id: 'test' };
      const result = roundPositionValues(input);
      expect(result).toEqual({ id: 'test' });
    });

    it('should handle zero values', () => {
      const input = {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      };
      const result = roundPositionValues(input);
      expect(result).toEqual({
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      });
    });
  });

  describe('getCorrectDroppedOffsetValue', () => {
    it('should calculate correct position when moving right and down', () => {
      const finalOffset = { x: 200, y: 200 };
      const initialOffset = { x: 100, y: 100 };
      const dropTargetPosition = { left: 50, top: 50 };

      const result = getCorrectDroppedOffsetValue(
        finalOffset,
        initialOffset,
        dropTargetPosition,
      );

      expect(result.left).toBe(150);
      expect(result.top).toBe(150);
    });

    it('should calculate correct position when moving left and up', () => {
      const finalOffset = { x: 50, y: 50 };
      const initialOffset = { x: 100, y: 100 };
      const dropTargetPosition = { left: 25, top: 25 };

      const result = getCorrectDroppedOffsetValue(
        finalOffset,
        initialOffset,
        dropTargetPosition,
      );

      expect(result.left).toBe(25);
      expect(result.top).toBe(25);
    });

    it('should apply zoom factor', () => {
      const finalOffset = { x: 200, y: 200 };
      const initialOffset = { x: 100, y: 100 };
      const dropTargetPosition = { left: 0, top: 0 };
      const zoom = 2;

      const result = getCorrectDroppedOffsetValue(
        finalOffset,
        initialOffset,
        dropTargetPosition,
        zoom,
      );

      expect(result.left).toBe(100);
      expect(result.top).toBe(100);
    });
  });

  describe('getStyles', () => {
    it('should return correct styles when not dragging', () => {
      const result = getStyles(100, 200, false);
      expect(result).toEqual({
        height: '',
        left: 100,
        opacity: 1,
        position: 'absolute',
        top: 200,
      });
    });

    it('should return hidden styles when dragging', () => {
      const result = getStyles(100, 200, true);
      expect(result).toEqual({
        height: 0,
        left: 100,
        opacity: 0,
        position: 'absolute',
        top: 200,
      });
    });
  });

  describe('isSelectedItem', () => {
    it('should return true if id is in activeElements', () => {
      const activeElements = ['item1', 'item2', 'item3'];
      expect(isSelectedItem('item2', activeElements)).toBe(true);
    });

    it('should return false if id is not in activeElements', () => {
      const activeElements = ['item1', 'item2', 'item3'];
      expect(isSelectedItem('item4', activeElements)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(isSelectedItem('item1', [])).toBe(false);
    });
  });

  describe('findItemById', () => {
    const pages = [
      {
        id: 'page1',
        items: [
          { id: 'item1', name: 'Item 1' },
          { id: 'item2', name: 'Item 2' },
        ],
      },
      {
        id: 'page2',
        items: [
          { id: 'item3', name: 'Item 3' },
        ],
      },
    ];

    it('should find item on first page', () => {
      const result = findItemById('item1', pages);
      expect(result).toEqual({ id: 'item1', name: 'Item 1' });
    });

    it('should find item on second page', () => {
      const result = findItemById('item3', pages);
      expect(result).toEqual({ id: 'item3', name: 'Item 3' });
    });

    it('should return null if item not found', () => {
      const result = findItemById('nonexistent', pages);
      expect(result).toBeNull();
    });

    it('should return null for empty pages', () => {
      const result = findItemById('item1', []);
      expect(result).toBeNull();
    });
  });

  describe('moveItemInArrayFromIndexToIndex', () => {
    it('should move item forward in array', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = moveItemInArrayFromIndexToIndex(array, 1, 3);
      expect(result).toEqual(['a', 'c', 'd', 'b', 'e']);
    });

    it('should move item backward in array', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = moveItemInArrayFromIndexToIndex(array, 3, 1);
      expect(result).toEqual(['a', 'd', 'b', 'c', 'e']);
    });

    it('should return same array if fromIndex equals toIndex', () => {
      const array = ['a', 'b', 'c'];
      const result = moveItemInArrayFromIndexToIndex(array, 1, 1);
      expect(result).toBe(array);
    });

    it('should not mutate original array', () => {
      const array = ['a', 'b', 'c', 'd'];
      moveItemInArrayFromIndexToIndex(array, 0, 3);
      expect(array).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('findItemsOnPage', () => {
    const pages = [
      {
        id: 'page1',
        items: [{ id: 'item1' }, { id: 'item2' }],
      },
      {
        id: 'page2',
        items: [{ id: 'item3' }],
      },
      {
        id: 'page3',
      },
    ];

    it('should return items for existing page', () => {
      const result = findItemsOnPage('page1', pages);
      expect(result).toEqual([{ id: 'item1' }, { id: 'item2' }]);
    });

    it('should return empty array for page without items', () => {
      const result = findItemsOnPage('page3', pages);
      expect(result).toEqual([]);
    });

    it('should return empty array for nonexistent page', () => {
      const result = findItemsOnPage('nonexistent', pages);
      expect(result).toEqual([]);
    });
  });

  describe('collisionCheck', () => {
    const items = [
      {
        height: 100, left: 0, top: 0, width: 100,
      },
      {
        height: 100, left: 50, top: 50, width: 100,
      },
      {
        height: 100, left: 200, top: 200, width: 100,
      },
    ];

    it('should detect collision when items overlap', () => {
      const item = {
        height: 100, left: 50, top: 50, width: 100,
      };
      const result = collisionCheck(item, items, 0, 1);
      // Returns index of first colliding item found
      expect(result).toBe(1);
    });

    it('should return null when no collision', () => {
      const item = {
        height: 50, left: 500, top: 500, width: 50,
      };
      const result = collisionCheck(item, items, 0, 1);
      expect(result).toBeNull();
    });
  });

  describe('getFileName', () => {
    it('should extract filename from URL', () => {
      const url = 'https://example.com/path/to/image.png';
      expect(getFileName(url)).toBe('image.png');
    });

    it('should handle URL with query parameters', () => {
      const url = 'https://example.com/file.pdf?version=1&token=abc';
      expect(getFileName(url)).toBe('file.pdf');
    });

    it('should handle empty string', () => {
      expect(getFileName('')).toBe('');
    });

    it('should handle undefined', () => {
      expect(getFileName()).toBe('');
    });

    it('should handle simple filename', () => {
      expect(getFileName('document.txt')).toBe('document.txt');
    });
  });

  describe('arrayMove', () => {
    it('should move element from one position to another', () => {
      const array = [1, 2, 3, 4, 5];
      const result = arrayMove(array, 0, 3);
      expect(result).toEqual([2, 3, 4, 1, 5]);
    });

    it('should not mutate original array', () => {
      const array = [1, 2, 3];
      arrayMove(array, 0, 2);
      expect(array).toEqual([1, 2, 3]);
    });

    it('should handle moving to same position', () => {
      const array = [1, 2, 3];
      const result = arrayMove(array, 1, 1);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('normalizeHexColor', () => {
    it('should add # prefix if missing', () => {
      expect(normalizeHexColor('ff0000')).toBe('#ff0000');
    });

    it('should keep # prefix if present', () => {
      expect(normalizeHexColor('#00ff00')).toBe('#00ff00');
    });

    it('should trim whitespace', () => {
      expect(normalizeHexColor('  #0000ff  ')).toBe('#0000ff');
    });
  });

  describe('isValidHexColor', () => {
    it('should validate 6-digit hex color', () => {
      expect(isValidHexColor('#ff0000')).toBe(true);
      expect(isValidHexColor('#00FF00')).toBe(true);
    });

    it('should validate 3-digit hex color', () => {
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('#0F0')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('#gggggg')).toBe(false);
      expect(isValidHexColor('ff0000')).toBe(false);
      expect(isValidHexColor('#ff00')).toBe(false);
      expect(isValidHexColor('#ff00000')).toBe(false);
    });
  });

  describe('isItemInSelectionBox', () => {
    it('should return true when item is inside selection box', () => {
      const selectionBox = {
        endX: 200, endY: 200, startX: 0, startY: 0,
      };
      const item = {
        height: 50, left: 50, top: 50, width: 50,
      };
      expect(isItemInSelectionBox(selectionBox, item)).toBe(true);
    });

    it('should return true when item partially overlaps', () => {
      const selectionBox = {
        endX: 100, endY: 100, startX: 0, startY: 0,
      };
      const item = {
        height: 100, left: 50, top: 50, width: 100,
      };
      expect(isItemInSelectionBox(selectionBox, item)).toBe(true);
    });

    it('should return false when item is outside selection box', () => {
      const selectionBox = {
        endX: 100, endY: 100, startX: 0, startY: 0,
      };
      const item = {
        height: 50, left: 200, top: 200, width: 50,
      };
      expect(isItemInSelectionBox(selectionBox, item)).toBe(false);
    });

    it('should apply zoom factor correctly', () => {
      const selectionBox = {
        endX: 100, endY: 100, startX: 0, startY: 0,
      };
      const item = {
        height: 50, left: 25, top: 25, width: 50,
      };
      // With zoom 2, item bounds become 50,50 to 150,150
      expect(isItemInSelectionBox(selectionBox, item, 2)).toBe(true);
    });

    it('should handle reversed selection box coordinates', () => {
      const selectionBox = {
        endX: 0, endY: 0, startX: 200, startY: 200,
      };
      const item = {
        height: 50, left: 50, top: 50, width: 50,
      };
      expect(isItemInSelectionBox(selectionBox, item)).toBe(true);
    });
  });

  describe('getItemsInSelectionBox', () => {
    const items = [
      {
        height: 50, id: 'item1', left: 50, top: 50, width: 50,
      },
      {
        height: 50, id: 'item2', left: 200, top: 200, width: 50,
      },
      {
        height: 50, id: 'item3', isLocked: true, left: 75, top: 75, width: 50,
      },
    ];

    it('should return ids of items in selection box', () => {
      const selectionBox = {
        endX: 150, endY: 150, startX: 0, startY: 0,
      };
      const result = getItemsInSelectionBox(selectionBox, items);
      expect(result).toEqual(['item1']);
    });

    it('should exclude locked items', () => {
      const selectionBox = {
        endX: 200, endY: 200, startX: 0, startY: 0,
      };
      const result = getItemsInSelectionBox(selectionBox, items);
      expect(result).not.toContain('item3');
    });

    it('should return empty array when no items in selection', () => {
      const selectionBox = {
        endX: 10, endY: 10, startX: 0, startY: 0,
      };
      const result = getItemsInSelectionBox(selectionBox, items);
      expect(result).toEqual([]);
    });
  });

  describe('getDimensions', () => {
    it('should extract dimension properties', () => {
      const input = {
        extra: 'ignored',
        height: 100,
        id: 'test',
        left: 50,
        top: 25,
        width: 200,
      };
      const result = getDimensions(input);
      expect(result).toEqual({
        height: 100,
        left: 50,
        top: 25,
        width: 200,
      });
    });
  });

  describe('calculateGuidePositions', () => {
    it('should calculate x-axis guide positions', () => {
      const dimensions = {
        height: 100, left: 100, top: 0, width: 200,
      };
      const result = calculateGuidePositions(dimensions, 'x');
      expect(result).toEqual([100, 200, 300]);
    });

    it('should calculate y-axis guide positions', () => {
      const dimensions = {
        height: 100, left: 0, top: 50, width: 200,
      };
      const result = calculateGuidePositions(dimensions, 'y');
      expect(result).toEqual([50, 100, 150]);
    });

    it('should apply zoom factor for items', () => {
      const dimensions = {
        height: 100, id: 'item1', left: 100, top: 0, width: 200,
      };
      const result = calculateGuidePositions(dimensions, 'x', 2);
      expect(result).toEqual([200, 400, 600]);
    });

    it('should filter by direction for items', () => {
      const dimensions = {
        height: 100, id: 'item1', left: 100, top: 0, width: 200,
      };
      const resultLeft = calculateGuidePositions(dimensions, 'x', 1, 'left');
      const resultRight = calculateGuidePositions(dimensions, 'x', 1, 'right');
      expect(resultLeft).toEqual([100]);
      expect(resultRight).toEqual([300]);
    });
  });

  describe('getTabsWithElements', () => {
    it('should organize config by sections', () => {
      const config = [
        { elements: [{ id: 'e1' }], section: 'SHAPES' },
        { elements: [{ id: 'e2' }], section: 'IMAGES' },
      ];
      const result = getTabsWithElements(config);
      expect(result).toHaveProperty('SHAPES');
      expect(result).toHaveProperty('IMAGES');
      expect(result.SHAPES.elements).toEqual([{ id: 'e1' }]);
    });

    it('should default to GENERAL section', () => {
      const config = [{ elements: [{ id: 'e1' }] }];
      const result = getTabsWithElements(config);
      expect(result).toHaveProperty('GENERAL');
    });
  });

  describe('emptyFunction', () => {
    it('should return the input value unchanged', () => {
      expect(emptyFunction(5)).toBe(5);
      expect(emptyFunction('test')).toBe('test');
      expect(emptyFunction(null)).toBe(null);
    });
  });
});
