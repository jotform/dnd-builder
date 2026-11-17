import { createPropStore } from '../../contexts/PropContext';

describe('PropContext - Undo/Redo', () => {
  let store;
  
  beforeEach(() => {
    store = createPropStore({});
    store.getState().setPages([{ id: 'page1', items: [] }]);
    store.getState().clearHistory();
  });

  describe('History Management', () => {
    it('should initialize with empty history', () => {
      const state = store.getState();
      expect(state.canUndo()).toBe(false);
      expect(state.canRedo()).toBe(false);
    });

    it('should save state to history when using setPagesWithHistory', () => {
      const initialPages = [{ id: 'page1', items: [] }];
      store.getState().setPages(initialPages);
      
      const newPages = [{ id: 'page1', items: [{ id: 'item1' }] }];
      store.getState().setPagesWithHistory(newPages);
      
      expect(store.getState().canUndo()).toBe(true);
      expect(store.getState().canRedo()).toBe(false);
    });

    it('should undo to previous state', () => {
      const initialPages = [{ id: 'page1', items: [] }];
      store.getState().setPages(initialPages);
      
      const newPages = [{ id: 'page1', items: [{ id: 'item1' }] }];
      store.getState().setPagesWithHistory(newPages);
      
      expect(store.getState().pages).toEqual(newPages);
      
      const result = store.getState().undo();
      expect(result).toBe(true);
      expect(store.getState().pages).toEqual(initialPages);
      expect(store.getState().canUndo()).toBe(false);
      expect(store.getState().canRedo()).toBe(true);
    });

    it('should redo to next state', () => {
      const initialPages = [{ id: 'page1', items: [] }];
      store.getState().setPages(initialPages);
      
      const newPages = [{ id: 'page1', items: [{ id: 'item1' }] }];
      store.getState().setPagesWithHistory(newPages);
      
      store.getState().undo();
      
      const result = store.getState().redo();
      expect(result).toBe(true);
      expect(store.getState().pages).toEqual(newPages);
      expect(store.getState().canUndo()).toBe(true);
      expect(store.getState().canRedo()).toBe(false);
    });

    it('should handle multiple undo operations', () => {
      const state1 = [{ id: 'page1', items: [] }];
      const state2 = [{ id: 'page1', items: [{ id: 'item1' }] }];
      const state3 = [{ id: 'page1', items: [{ id: 'item1' }, { id: 'item2' }] }];
      
      store.getState().setPages(state1);
      store.getState().setPagesWithHistory(state2);
      store.getState().setPagesWithHistory(state3);
      
      expect(store.getState().pages).toEqual(state3);
      
      store.getState().undo();
      expect(store.getState().pages).toEqual(state2);
      
      store.getState().undo();
      expect(store.getState().pages).toEqual(state1);
      
      expect(store.getState().canUndo()).toBe(false);
    });

    it('should clear future on new change after undo', () => {
      const state1 = [{ id: 'page1', items: [] }];
      const state2 = [{ id: 'page1', items: [{ id: 'item1' }] }];
      const state3 = [{ id: 'page1', items: [{ id: 'item3' }] }];
      
      store.getState().setPages(state1);
      store.getState().setPagesWithHistory(state2);
      store.getState().undo();
      
      // New change should clear redo history
      store.getState().setPagesWithHistory(state3);
      
      expect(store.getState().canRedo()).toBe(false);
      expect(store.getState().pages).toEqual(state3);
    });

    it('should return false when undo is not possible', () => {
      const result = store.getState().undo();
      expect(result).toBe(false);
    });

    it('should return false when redo is not possible', () => {
      const result = store.getState().redo();
      expect(result).toBe(false);
    });

    it('should clear history', () => {
      const state1 = [{ id: 'page1', items: [] }];
      const state2 = [{ id: 'page1', items: [{ id: 'item1' }] }];
      
      store.getState().setPages(state1);
      store.getState().setPagesWithHistory(state2);
      store.getState().undo();
      
      store.getState().clearHistory();
      
      expect(store.getState().canUndo()).toBe(false);
      expect(store.getState().canRedo()).toBe(false);
    });

    it('should call onUndo callback when undoing', () => {
      const onUndo = jest.fn();
      store = createPropStore({ onUndo });
      
      const state1 = [{ id: 'page1', items: [] }];
      const state2 = [{ id: 'page1', items: [{ id: 'item1' }] }];
      
      store.getState().setPages(state1);
      store.getState().setPagesWithHistory(state2);
      store.getState().undo();
      
      expect(onUndo).toHaveBeenCalledWith(state1);
    });

    it('should call onRedo callback when redoing', () => {
      const onRedo = jest.fn();
      store = createPropStore({ onRedo });
      
      const state1 = [{ id: 'page1', items: [] }];
      const state2 = [{ id: 'page1', items: [{ id: 'item1' }] }];
      
      store.getState().setPages(state1);
      store.getState().setPagesWithHistory(state2);
      store.getState().undo();
      store.getState().redo();
      
      expect(onRedo).toHaveBeenCalledWith(state2);
    });

    it('should respect history limit', () => {
      // HISTORY_LIMIT is 50, but we'll test that old items are removed
      const store = createPropStore({});
      store.getState().setPages([]);
      
      // Make 55 changes
      for (let i = 0; i < 55; i++) {
        store.getState().setPagesWithHistory([{ id: `page${i}` }]);
      }
      
      // Should be able to undo 50 times (limit)
      let undoCount = 0;
      while (store.getState().canUndo()) {
        store.getState().undo();
        undoCount++;
      }
      
      expect(undoCount).toBe(50);
    });
  });
});
