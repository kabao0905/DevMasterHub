import { tachCo, type LenhThuan } from './terminal-van-ban';
import type { HamDich } from './terminal-ban-dich';

const MAY = 'devmaster-cyber-box';
const IP_MAY = '192.168.1.50';
const PHAN_GIAI: Record<string, string> = {
  localhost: '127.0.0.1',
  [MAY]: IP_MAY,
  'target-bank-api.local': '192.168.1.100',
  'devmaster.hub': '203.0.113.10',
  'google.com': '142.250.66.78'
};
const laIp = (s: string) => /^\d{1,3}(\.\d{1,3}){3}$/.test(s);

const PS = `
  PID TTY          TIME CMD
    1 ?        00:00:03 /sbin/init
  301 ?        00:00:00 dhclient
  412 ?        00:00:00 sshd: /usr/sbin/sshd -D
  878 ?        00:00:01 apache2 -k start
 1102 ?        00:00:02 mysqld --datadir=/var/lib/mysql
 1337 ?        00:04:52 /usr/local/bin/.sysupdate --port 4444 --conf /etc/.hidden/backdoor.conf
 2051 pts/0    00:00:00 bash
 2088 pts/0    00:00:00 ps
`;

const NETSTAT = `
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address        Foreign Address   State    PID/Program name
tcp        0      0 0.0.0.0:22           0.0.0.0:*         LISTEN   412/sshd
tcp        0      0 0.0.0.0:80           0.0.0.0:*         LISTEN   878/apache2
tcp        0      0 0.0.0.0:8080         0.0.0.0:*         LISTEN   878/apache2
tcp        0      0 127.0.0.1:3306       0.0.0.0:*         LISTEN   1102/mysqld
tcp        0      0 0.0.0.0:4444         0.0.0.0:*         LISTEN   1337/.sysupdate
udp        0      0 0.0.0.0:68           0.0.0.0:*                  301/dhclient
`;

const SS = `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port  Process
udp   UNCONN 0      0      0.0.0.0:68          0.0.0.0:*          users:(("dhclient",pid=301,fd=6))
tcp   LISTEN 0      128    0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=412,fd=3))
tcp   LISTEN 0      511    0.0.0.0:80          0.0.0.0:*          users:(("apache2",pid=878,fd=4))
tcp   LISTEN 0      511    0.0.0.0:8080        0.0.0.0:*          users:(("apache2",pid=878,fd=6))
tcp   LISTEN 0      151    127.0.0.1:3306      0.0.0.0:*          users:(("mysqld",pid=1102,fd=21))
tcp   LISTEN 0      5      0.0.0.0:4444        0.0.0.0:*          users:((".sysupdate",pid=1337,fd=4))
tcp   ESTAB  0      0      ${IP_MAY}:51022  10.0.0.66:443      users:((".sysupdate",pid=1337,fd=5))`;

const LSOF = [
  'COMMAND      PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME',
  'sshd         412  root    3u  IPv4  12345      0t0  TCP *:22 (LISTEN)',
  'apache2      878  root    4u  IPv4  12401      0t0  TCP *:80 (LISTEN)',
  'apache2      878  root    6u  IPv4  12403      0t0  TCP *:8080 (LISTEN)',
  'mysqld      1102 mysql   21u  IPv4  13310      0t0  TCP localhost:3306 (LISTEN)',
  '.sysupdate  1337  root    4u  IPv4  31337      0t0  TCP *:4444 (LISTEN)',
  `.sysupdate  1337  root    5u  IPv4  31338      0t0  TCP ${IP_MAY}:51022->10.0.0.66:443 (ESTABLISHED)`
];

const NMAP = (dich: string) => `
Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-20 20:00 ICT
Nmap scan report for ${dich}
Host is up (0.00042s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1
80/tcp   open  http    Apache httpd 2.4.58
8080/tcp open  http    DevMaster-API-Gateway (FLAG{devmaster_nmap_port_8080_opened})
3306/tcp open  mysql   MySQL 8.0.36

Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds
`;

const IFCONFIG = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet ${IP_MAY}  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 02:42:ac:11:00:32  txqueuelen 1000  (Ethernet)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`;

const IP_ADDR = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 02:42:ac:11:00:32 brd ff:ff:ff:ff:ff:ff
    inet ${IP_MAY}/24 brd 192.168.1.255 scope global eth0`;

const IP_ROUTE = `default via 192.168.1.1 dev eth0\n192.168.1.0/24 dev eth0 proto kernel scope link src ${IP_MAY}`;

const LAST = `hacker   pts/0        192.168.1.5      Mon Oct 12 20:41   still logged in
root     pts/1        10.0.0.66        Sun Oct 11 03:12 - 03:47  (00:35)
root     pts/1        10.0.0.66        Sun Oct 11 02:58 - 03:01  (00:03)
hacker   pts/0        192.168.1.5      Sat Oct 10 09:15 - 17:30  (08:15)
reboot   system boot  6.8.0-devmaster  Sat Oct 10 09:10   still running

wtmp begins Sat Oct 10 09:10:02 2026`;

const THU = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const THANG = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const hai = (n: number) => String(n).padStart(2, '0');

function ngayGio(): string {
  const d = new Date();
  return `${THU[d.getDay()]} ${THANG[d.getMonth()]} ${hai(d.getDate())} ${hai(d.getHours())}:${hai(d.getMinutes())}:${hai(d.getSeconds())} +07 ${d.getFullYear()}`;
}

const ping: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args, 'c');
  const dich = conLai[0];
  if (!dich) return `ping: ${nc.t('loi.cachDung', { cu: 'ping [-c count] <host>' })}`;
  const ip = laIp(dich) ? dich : PHAN_GIAI[dich];
  if (!ip) return `ping: ${dich}: Name or service not known`;
  const n = Math.min(Math.max(parseInt(String(co.c ?? '4'), 10) || 4, 1), 10);
  const goi = Array.from({ length: n }, (_, i) => `64 bytes from ${ip}: icmp_seq=${i + 1} ttl=64 time=0.${40 + i * 3} ms`);
  return [`PING ${dich} (${ip}) 56(84) bytes of data.`, ...goi, '', `--- ${dich} ping statistics ---`,
    `${n} packets transmitted, ${n} received, 0% packet loss`].join('\n');
};

function traTenMien(ten: 'dig' | 'nslookup' | 'host', args: string[], t: HamDich): string {
  const may = args.find(a => !a.startsWith('-') && !a.startsWith('@'));
  if (!may) return `${ten}: ${t('loi.cachDung', { cu: `${ten} <domain>` })}`;
  const ip = PHAN_GIAI[may];
  if (ten === 'host') return ip ? `${may} has address ${ip}` : `Host ${may} not found: 3(NXDOMAIN)`;
  if (ten === 'nslookup') {
    return ['Server:\t\t192.168.1.1', 'Address:\t192.168.1.1#53', '', ip ? `Name:\t${may}\nAddress: ${ip}` : `** server can't find ${may}: NXDOMAIN`].join('\n');
  }
  return [`; <<>> DiG 9.18.24 <<>> ${may}`, ';; QUESTION SECTION:', `;${may}.\t\t\tIN\tA`, '',
    ip ? `;; ANSWER SECTION:\n${may}.\t\t300\tIN\tA\t${ip}` : ';; status: NXDOMAIN', '', ';; SERVER: 192.168.1.1#53(192.168.1.1)'].join('\n');
}

const lsof: LenhThuan['chay'] = (args, nc) => {
  const cong = args.find(a => a.startsWith(':') || a.startsWith('-i:'))?.replace(/^-i/, '');
  if (!args.includes('-i') && !cong) return `lsof: ${nc.t('loi.chiHoTro', { ds: 'lsof -i [:port]' })}`;
  const dong = cong ? LSOF.slice(1).filter(l => l.includes(cong + ' ') || l.includes(cong + '->')) : LSOF.slice(1);
  return dong.length ? [LSOF[0], ...dong].join('\n') : '';
};

const ip: LenhThuan['chay'] = (args, nc) => {
  if (!args[0] || /^a/.test(args[0])) return IP_ADDR;
  if (/^r/.test(args[0])) return IP_ROUTE;
  return `ip: ${nc.t('loi.chiHoTro', { ds: 'ip a, ip route' })}`;
};

const sudo: LenhThuan['chay'] = (args, nc) => {
  if (args[0] === '-l') {
    return `Matching Defaults entries for hacker on ${MAY}:\n    env_reset, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n\n`
      + `User hacker may run the following commands on ${MAY}:\n    (ALL : ALL) ALL`;
  }
  return `sudo: ${nc.t('loi.khongRoot')}`;
};

const tinh = (ra: string): LenhThuan['chay'] => () => ra;

export const LENH_HE_THONG: Record<string, LenhThuan> = {
  whoami: { usage: 'whoami', chay: tinh('hacker (uid=1000 gid=1000 groups=hacker,sudo)') },
  id: { usage: 'id', chay: tinh('uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo)') },
  uname: { usage: 'uname -a', chay: tinh(`Linux ${MAY} 6.8.0-devmaster-x86_64 #1 SMP GNU/Linux`) },
  hostname: { usage: 'hostname', chay: tinh(MAY) },
  date: { usage: 'date', chay: () => ngayGio() },
  uptime: { usage: 'uptime', chay: tinh(' 21:00:00 up 2 days, 11:50,  1 user,  load average: 0.42, 0.37, 0.31') },
  ps: { usage: 'ps [aux]', chay: tinh(PS) },
  netstat: { usage: 'netstat [-tuln]', chay: tinh(NETSTAT) },
  ss: { usage: 'ss -tulpn', chay: tinh(SS) },
  lsof: { usage: 'lsof -i [:port]', chay: lsof },
  nmap: { usage: 'nmap <target>', chay: args => NMAP(args.find(a => !a.startsWith('-')) || '127.0.0.1') },
  ifconfig: { usage: 'ifconfig', chay: tinh(IFCONFIG) },
  ip: { usage: 'ip a | ip route', chay: ip },
  ping: { usage: 'ping [-c N] <host>', chay: ping },
  dig: { usage: 'dig <domain>', chay: (args, nc) => traTenMien('dig', args, nc.t) },
  nslookup: { usage: 'nslookup <domain>', chay: (args, nc) => traTenMien('nslookup', args, nc.t) },
  host: { usage: 'host <domain>', chay: (args, nc) => traTenMien('host', args, nc.t) },
  w: { usage: 'w', chay: tinh(' 21:00:00 up 2 days, 11:50,  1 user\nUSER     TTY      FROM             LOGIN@   IDLE   WHAT\nhacker   pts/0    192.168.1.5      20:41    0.00s  bash') },
  who: { usage: 'who', chay: tinh('hacker   pts/0        2026-10-12 20:41 (192.168.1.5)') },
  last: { usage: 'last', chay: tinh(LAST) },
  sudo: { usage: 'sudo -l', chay: sudo },
  env: { usage: 'env', chay: tinh('USER=hacker\nHOME=/home/hacker\nSHELL=/bin/bash\nLANG=C.UTF-8\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin') },
  df: { usage: 'df -h', chay: tinh('Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        40G   12G   26G  32% /\ntmpfs           2.0G     0  2.0G   0% /dev/shm') },
  free: { usage: 'free -h', chay: tinh('               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       1.1Gi       1.9Gi        12Mi       0.8Gi       2.5Gi\nSwap:          1.0Gi          0B       1.0Gi') }
};
