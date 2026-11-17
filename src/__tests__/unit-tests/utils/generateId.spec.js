import generateId from '../../../utils/generateId';

describe('utils/generateId', () => {
  describe('generateId', () => {
    it('should generate id with default length of 6', () => {
      const id = generateId();
      expect(id).toHaveLength(6);
    });

    it('should generate id with specified length', () => {
      const id8 = generateId(8);
      const id10 = generateId(10);
      const id3 = generateId(3);

      expect(id8).toHaveLength(8);
      expect(id10).toHaveLength(10);
      expect(id3).toHaveLength(3);
    });

    it('should generate string type', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should only contain allowed characters', () => {
      const allowedChars = '1234567890jotfrm';
      const id = generateId(100); // longer to increase chance of catching invalid chars

      for (const char of id) {
        expect(allowedChars).toContain(char);
      }
    });

    it('should generate unique ids', () => {
      const ids = new Set();
      const count = 100;

      for (let i = 0; i < count; i++) {
        ids.add(generateId());
      }

      // While collisions are theoretically possible, they should be extremely rare
      expect(ids.size).toBe(count);
    });

    it('should generate different ids on consecutive calls', () => {
      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId();

      // These should all be different (extremely high probability)
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });
});
