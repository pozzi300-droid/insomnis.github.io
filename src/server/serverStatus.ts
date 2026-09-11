export interface ServerStatusInfo {
  online: boolean;
  serverName: string;
  ip: string;
  port: number;
  version: string;
  players: {
    online: number;
    max: number;
    list?: string[];
  };
  motd: {
    raw: string;
    clean: string;
  };
  ping: number;
  daysOnline: number;
  privilegesSold: number;
  registeredUsers: number;
}

export function getServerStatus(): ServerStatusInfo {
  return {
    online: true,
    serverName: 'Insomnis Vanilla',
    ip: 'insomnis.fun',
    port: 25565,
    version: '1.21.11 Java Edition',
    players: {
      online: 128,
      max: 500,
    },
    motd: {
      raw: '§bInsomnis §8| §fИдеальный ванильный сервер для выживания §7[1.21.x]',
      clean: 'Insomnis | Идеальный ванильный сервер для выживания [1.21.x]',
    },
    ping: 24,
    daysOnline: 620,
    privilegesSold: 1420,
    registeredUsers: 6040,
  };
}
