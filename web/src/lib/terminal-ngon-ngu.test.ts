import { createTerminal, CHALLENGES } from './terminal';
import { MO_TA_LENH } from './terminal-mo-ta-lenh';
import { NGON_NGU_TERMINAL, THONG_BAO, dichThuThach } from './terminal-ban-dich';

const CHU_VIET = /[ạảãầấậẩẫăằắặẳẵđẹẻẽềếệểễịỉĩọỏõồốộổỗơờớợởỡụủũưừứựửữỳỵỷỹ]/i;
const boMau = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

test('moi lenh trong help co mo ta du 8 ngon ngu; moi thong bao cung du 8', () => {
  const T = createTerminal();
  expect(Object.keys(MO_TA_LENH).sort()).toEqual(T.commandNames().slice().sort());
  for (const [ten, ds] of [...Object.entries(MO_TA_LENH), ...Object.entries(THONG_BAO)]) {
    expect(ds, ten).toHaveLength(NGON_NGU_TERMINAL.length);
    ds.forEach((s, i) => expect(s.trim(), `${ten}[${NGON_NGU_TERMINAL[i]}]`).not.toBe(''));
    ds.slice(1).forEach((s, i) => expect(s, `${ten}[${NGON_NGU_TERMINAL[i + 1]}] lot chu Viet`).not.toMatch(CHU_VIET));
  }
});

test('chon tieng Anh: help, goi y loi, loi cu phap deu tieng Anh', () => {
  const T = createTerminal();
  T.datNgonNgu('en');
  const help = boMau(T.executeCommand('help'));
  expect(help).toContain(MO_TA_LENH.grep[1]);
  expect(help).not.toMatch(CHU_VIET);
  for (const l of ['wc -l', 'cat "x', '| grep a', 'grep', 'awk', 'sed', 'cut', 'tr', 'ping', 'sudo ls', 'file', 'which', 'chmod', 'bash', 'crontab', 'lsof', 'base64', 'xyz']) {
    expect(T.executeCommand(l), l).not.toMatch(CHU_VIET);
  }
  expect(T.executeCommand('xyz')).toMatch(/command not found/);
});

test('doi ngon ngu giua chung; tieng Nhat dung ban Nhat', () => {
  const T = createTerminal();
  expect(T.executeCommand('help')).toContain(MO_TA_LENH.ls[0]);
  T.datNgonNgu('ja');
  expect(T.executeCommand('help')).toContain(MO_TA_LENH.ls[2]);
  T.datNgonNgu('vi');
  expect(T.executeCommand('wc -l')).toMatch(/thiếu tên tệp/);
});

test('&& van biet lenh truoc hong o moi ngon ngu', () => {
  for (const lang of NGON_NGU_TERMINAL) {
    const T = createTerminal();
    T.datNgonNgu(lang);
    expect(T.executeCommand('wc -l && echo SAU'), lang).not.toContain('SAU');
    expect(T.executeCommand('cat /khong-co && echo SAU'), lang).not.toContain('SAU');
    expect(T.executeCommand('pwd && echo SAU'), lang).toContain('SAU');
  }
});

test('CTF: thong bao nop co va ten thu thach theo ngon ngu; co van giong nhau', () => {
  const T = createTerminal();
  T.datNgonNgu('en');
  const kq = T.executeCommand('submit ' + CHALLENGES[0].flag);
  expect(kq).toContain(dichThuThach(CHALLENGES[0], 'en').title);
  expect(kq).not.toMatch(CHU_VIET);
  expect(T.executeCommand('submit FLAG{sai}')).not.toMatch(CHU_VIET);
  for (const lang of NGON_NGU_TERMINAL) {
    for (const c of CHALLENGES) {
      const d = dichThuThach(c, lang);
      expect(d.title, `${c.id} ${lang}`).toMatch(/Challenge \d/);
      expect(d.desc && d.hint, `${c.id} ${lang}`).toBeTruthy();
    }
  }
});

test('tep mac dinh doc duoc theo ngon ngu; doi ngon ngu thi tep chua sua doi theo, tep da sua giu nguyen', () => {
  const T = createTerminal({}, 'en');
  expect(T.executeCommand('cat /home/hacker/readme.txt')).not.toMatch(CHU_VIET);
  T.executeCommand('echo "ghi chu rieng" > /home/hacker/notes.md');
  T.datNgonNgu('vi');
  expect(T.executeCommand('cat /home/hacker/readme.txt')).toMatch(CHU_VIET);
  expect(T.executeCommand('cat /home/hacker/notes.md')).toBe('ghi chu rieng');
  expect(T.executeCommand('file /bin/bash')).toMatch(/ELF/);
});
