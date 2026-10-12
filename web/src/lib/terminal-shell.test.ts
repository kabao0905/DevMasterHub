// Terminal giong shell that hon: pipe, dau nhay, glob, ; && , < > >>, va bo lenh xu ly van ban / he thong.
import { createHash } from 'node:crypto';
import { createTerminal, type HeThongTep } from './terminal';

const AUTH = [
  'Failed password for root from 10.0.0.66 port 22',
  'Accepted password for hacker from 192.168.1.5 port 22',
  'Failed password for admin from 10.0.0.66 port 22',
  'Failed password for root from 10.0.0.77 port 22'
].join('\n');

const FS: HeThongTep = {
  '/': { type: 'dir', children: ['home', 'var', 'etc'] },
  '/home': { type: 'dir', children: ['hacker'] },
  '/home/hacker': { type: 'dir', children: ['auth.log', 'ds.csv', 'script.sh', 'a.txt', 'b.txt'] },
  '/home/hacker/auth.log': { type: 'file', content: AUTH },
  '/home/hacker/ds.csv': { type: 'file', content: 'ten,tuoi,thanh_pho\nAn,20,Ha Noi\nBinh,35,Hue\nChi,28,Da Nang' },
  '/home/hacker/script.sh': { type: 'file', content: '#!/bin/bash\n# dem dong\necho bat dau\ncat ds.csv | wc -l' },
  '/home/hacker/a.txt': { type: 'file', content: 'mot\nhai\nba' },
  '/home/hacker/b.txt': { type: 'file', content: 'mot\nHAI\nba' },
  '/var': { type: 'dir', children: ['log'] },
  '/var/log': { type: 'dir', children: ['a.log', 'b.log', 'c.txt'] },
  '/var/log/a.log': { type: 'file', content: 'loi A' },
  '/var/log/b.log': { type: 'file', content: 'loi B' },
  '/var/log/c.txt': { type: 'file', content: 'khong' },
  '/etc': { type: 'dir', children: ['passwd'] },
  '/etc/passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000::/home/hacker:/bin/bash' }
};

function may() {
  const T = createTerminal();
  T.loadFs(FS);
  return (lenh: string) => T.executeCommand(lenh).replace(/\u001b\[[0-9;]*m/g, '');
}

describe('cu phap shell', () => {
  test('pipe noi nhieu lenh', () => {
    const $ = may();
    expect($('cat auth.log | grep Failed | wc -l')).toBe('3');
    expect($('grep Failed auth.log | awk \'{print $6}\' | sort | uniq -c | sort -rn | head -1')).toMatch(/^\s*2 10\.0\.0\.66$/);
  });

  test('dau nhay giu nguyen chuoi co khoang trang; glob trong dau nhay khong bung', () => {
    const $ = may();
    expect($('grep "Failed password for root" auth.log | wc -l')).toBe('2');
    expect($("grep 'for admin' auth.log")).toBe('Failed password for admin from 10.0.0.66 port 22');
    expect($('echo "*.log"')).toBe('*.log');
  });

  test('glob * bung thanh danh sach tep', () => {
    const $ = may();
    expect($('cat /var/log/*.log')).toBe('loi A\nloi B');
    expect($('ls /var/log/*.log | wc -l')).toBe('2');
  });

  test('chuyen huong > >> < sau pipe', () => {
    const $ = may();
    expect($('grep Failed auth.log | cut -d" " -f6 > ips.txt')).toBe('');
    expect($('cat ips.txt | uniq | wc -l')).toBe('2');
    expect($('wc -l < ips.txt')).toBe('3');
    $('echo them >> ips.txt');
    expect($('tail -n 1 ips.txt')).toBe('them');
  });

  test('; va && chay lan luot', () => {
    const $ = may();
    expect($('cd /var/log && ls')).toMatch(/a\.log/);
    expect($('pwd; whoami')).toMatch(/^\/var\/log\n[\s\S]*hacker/);
  });

  test('loi cu phap noi ro', () => {
    const $ = may();
    expect($('cat "auth.log')).toMatch(/thiếu dấu nháy/);
    expect($('| grep x')).toMatch(/lỗi cú pháp/);
  });

  test('ls khi bi pipe in moi ten mot dong, khong mau', () => {
    const $ = may();
    expect($('ls /var/log | wc -l')).toBe('3');
    expect($('ls /var/log | grep log')).toBe('a.log\nb.log');
  });
});

describe('lenh xu ly van ban', () => {
  test('head / tail / cat -n', () => {
    const $ = may();
    expect($('head -n 2 auth.log | tail -1')).toBe('Accepted password for hacker from 192.168.1.5 port 22');
    expect($('head -1 /etc/passwd | cut -d: -f1')).toBe('root');
    expect($('cat -n auth.log | head -1')).toBe('     1\tFailed password for root from 10.0.0.66 port 22');
  });

  test('cut / sort / tail +N', () => {
    const $ = may();
    expect($('cut -d, -f1 ds.csv | tail -n +2')).toBe('An\nBinh\nChi');
    expect($('tail -n +2 ds.csv | sort -t, -k2 -n | head -n 1')).toBe('An,20,Ha Noi');
    expect($('cut -d, -f1,3 ds.csv | head -2 | tail -1')).toBe('An,Ha Noi');
  });

  test('grep: -i -v -n -c -o -E -r -l, khong khop thi khong in gi', () => {
    const $ = may();
    expect($('grep -c Failed auth.log')).toBe('3');
    expect($('grep -v Failed auth.log')).toMatch(/^Accepted/);
    expect($('grep -n Accepted auth.log')).toMatch(/^2:Accepted/);
    expect($('grep -i accepted auth.log | wc -l')).toBe('1');
    expect($('grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" auth.log | sort -u')).toBe('10.0.0.66\n10.0.0.77\n192.168.1.5');
    expect($('grep -r loi /var/log')).toBe('/var/log/a.log:loi A\n/var/log/b.log:loi B');
    expect($('grep -rl loi /var/log')).toBe('/var/log/a.log\n/var/log/b.log');
    expect($('grep zzz auth.log')).toBe('');
  });

  test('awk: -F, mau /re/, so sanh truong, END NR', () => {
    const $ = may();
    expect($("awk '/Accepted/ {print $4, $6}' auth.log")).toBe('hacker 192.168.1.5');
    expect($("tail -n +2 ds.csv | awk -F, '$2 > 25 {print $1}'")).toBe('Binh\nChi');
    expect($("awk 'END {print NR}' auth.log")).toBe('4');
    expect($("awk -F: '{print $NF}' /etc/passwd | head -1")).toBe('/bin/bash');
  });

  test('sed: s///g, -n Np, /re/d', () => {
    const $ = may();
    expect($("sed 's/Failed/FAIL/g' auth.log | grep -c FAIL")).toBe('3');
    expect($("sed -n '2p' auth.log")).toBe('Accepted password for hacker from 192.168.1.5 port 22');
    expect($("sed '/Failed/d' auth.log")).toBe('Accepted password for hacker from 192.168.1.5 port 22');
  });

  test('tr / rev / tac / nl / uniq -d / diff', () => {
    const $ = may();
    expect($('echo hello | tr a-z A-Z')).toBe('HELLO');
    expect($('echo abc | rev')).toBe('cba');
    expect($('tac a.txt')).toBe('ba\nhai\nmot');
    expect($('nl a.txt | head -1')).toBe('     1\tmot');
    expect($('diff a.txt b.txt')).toMatch(/< hai[\s\S]*> HAI/);
    expect($('wc -l')).toMatch(/thiếu tên tệp/);
  });
});

describe('ma hoa', () => {
  test('base64 qua pipe, hai chieu, ca tieng Viet', () => {
    const $ = may();
    expect($('echo aGkK | base64 -d')).toBe('hi');
    expect($('echo hi | base64')).toBe('aGkK');
    expect($('echo "xin chào" | base64 | base64 -d')).toBe('xin chào');
  });

  test('sha256sum va xxd giong Linux that', () => {
    const $ = may();
    const bam = createHash('sha256').update('abc\n').digest('hex');
    expect($('echo abc | sha256sum')).toBe(`${bam}  -`);
    expect($('echo AB | xxd')).toMatch(/^00000000: 4142 0a\s+AB\.$/);
  });
});

describe('lenh he thong va tep', () => {
  test('touch, ls -l, chmod +x, chay script', () => {
    const $ = may();
    $('touch moi.txt');
    expect($('ls')).toMatch(/moi\.txt/);
    expect($('ls -l script.sh')).toMatch(/^-rw-r--r--/);
    expect($('./script.sh')).toMatch(/Permission denied/);
    expect($('bash script.sh')).toBe('bat dau\n4');
    $('chmod +x script.sh');
    expect($('ls -l script.sh')).toMatch(/^-rwxr-xr-x/);
    expect($('./script.sh')).toBe('bat dau\n4');
  });

  test('find -type -name, tree, file, history', () => {
    const $ = may();
    expect($('find /var -type f -name "*.log"')).toBe('/var/log/a.log\n/var/log/b.log');
    expect($('find /var -type d')).toBe('/var\n/var/log');
    expect($('tree /var/log')).toMatch(/├── a\.log/);
    expect($('file script.sh')).toMatch(/shell script/);
    expect($('history | tail -1')).toMatch(/history/);
  });

  test('lenh mang / he thong co ket qua khop may nay', () => {
    const $ = may();
    expect($('hostname')).toBe('devmaster-cyber-box');
    expect($('ifconfig')).toMatch(/inet /);
    expect($('ip a')).toMatch(/inet /);
    expect($('ss -tulpn | grep 4444')).toMatch(/sysupdate/);
    expect($('lsof -i :4444')).toMatch(/sysupdate/);
    expect($('which grep')).toBe('/usr/bin/grep');
    expect($('sudo -l')).toMatch(/may run/);
    expect($('crontab -l')).toMatch(/no crontab for hacker/);
    expect($('date')).not.toBe('');
  });
});
