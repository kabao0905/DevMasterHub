function taoBoNhoTam({ songMs, toiDa, bayGio = () => Date.now() }) {
  const muc = new Map();

  function giu(khoa, gt) {
    muc.delete(khoa);
    muc.set(khoa, gt);
    while (muc.size > toiDa) muc.delete(muc.keys().next().value);
  }

  return {
    get kichThuoc() { return muc.size; },
    async lay(khoa, tao, { nenLuu = () => true } = {}) {
      const co = muc.get(khoa);
      if (co && (co.dangCho || co.het > bayGio())) {
        giu(khoa, co);
        return co.dangCho ?? co.giaTri;
      }
      const dangCho = Promise.resolve().then(tao);
      giu(khoa, { dangCho });
      try {
        const giaTri = await dangCho;
        if (nenLuu(giaTri)) giu(khoa, { giaTri, het: bayGio() + songMs });
        else muc.delete(khoa);
        return giaTri;
      } catch (e) {
        muc.delete(khoa);
        throw e;
      }
    }
  };
}

module.exports = { taoBoNhoTam };
