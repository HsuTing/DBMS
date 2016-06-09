'use strict';

import Long from 'long';

export default (key) => {
  let hv = Long.fromInt(0, true);

  key
    .split("")
    .map((k, i) => {
      hv = hv.shl(5)
        .add(hv)
        .add(
          Long.fromInt(k.charCodeAt(0), true)
        );
    });
  hv = hv % 10;

  return hv;
};
