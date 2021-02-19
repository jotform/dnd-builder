const isStrictEqual = (a, b) => {
  return a === b;
};
const objectDiff = (opts, subjects) => {
  const { length } = subjects;
  const ref = subjects[0];
  const diff = {};
  const equal = (opts && opts.equal) || isStrictEqual;
  let c;
  let keys;
  let keysLength;
  let key;
  var u;
  for (var i = 1; i < length; i++) {
    c = subjects[i];
    keys = Object.keys(c);
    keysLength = keys.length;

    for (u = 0; u < keysLength; u++) {
      key = keys[u];

      if (!equal(c[key], ref[key])) { diff[key] = c[key]; }
    }
  }
  return diff;
};

export default function strict(...args) {
  return objectDiff(null, [].slice.call(args, 0));
}
