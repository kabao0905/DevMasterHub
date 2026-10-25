async function* docSse(body) {
  const reader = body.getReader();
  const giaiMa = new TextDecoder();
  let dem = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      dem += giaiMa.decode(value, { stream: true });
      let i;
      while ((i = dem.indexOf('\n')) >= 0) {
        const dong = dem.slice(0, i).trim();
        dem = dem.slice(i + 1);
        if (!dong.startsWith('data:')) continue;
        const duLieu = dong.slice(5).trim();
        if (duLieu === '[DONE]') return;
        yield JSON.parse(duLieu);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

module.exports = { docSse };
