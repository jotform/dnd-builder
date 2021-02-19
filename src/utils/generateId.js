if (!window.crypto) { // for IE
  window.crypto = window.msCrypto;
}
// eslint-disable-next-line
import { customAlphabet } from 'nanoid';

const generateId = (length = 6) => {
  const id = customAlphabet('1234567890jotfrm', length);
  return id().toString();
};

export default generateId;
