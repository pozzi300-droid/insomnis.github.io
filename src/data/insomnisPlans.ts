export interface InsomnisPlanMetadata {
  cpu: string;
  cpu_model: string;
  ram: string;
  disk: string;
  ports: number;
  databases: number;
  backups: number;
  antiddos: string;
  network_speed: string;
}

export interface InsomnisPlan {
  id: string;
  name: string;
  serviceType: 'game' | 'coding';
  location: string;
  locationKey: 'germany' | 'moscow' | 'finland';
  price: number;
  discount: number;
  metadata: InsomnisPlanMetadata;
}

export const insomnisPlans: InsomnisPlan[] = [
  {
    id: '556a3c96-7e7a-41b1-8416-ee58bd678a4c',
    name: 'coding-1',
    serviceType: 'coding',
    location: 'Германия',
    locationKey: 'germany',
    price: 89,
    discount: 0,
    metadata: {
      cpu: '100%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '2 ГБ DDR4',
      disk: '10 ГБ NVMe',
      ports: 1,
      databases: 1,
      backups: 1,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '6ec2a035-e247-489a-a316-9093cdca5d09',
    name: 'coding-2',
    serviceType: 'coding',
    location: 'Германия',
    locationKey: 'germany',
    price: 119,
    discount: 0,
    metadata: {
      cpu: '200%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '4 ГБ DDR4',
      disk: '20 ГБ NVMe',
      ports: 1,
      databases: 3,
      backups: 3,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '4774e6c1-a471-4e64-8779-73c88f685a2b',
    name: 'coding-3',
    serviceType: 'coding',
    location: 'Германия',
    locationKey: 'germany',
    price: 239,
    discount: 0,
    metadata: {
      cpu: '400%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '8 ГБ DDR4',
      disk: '30 ГБ NVMe',
      ports: 1,
      databases: 5,
      backups: 5,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '965adb3a-5cbd-4a8f-8a70-5c37d837f6a8',
    name: 'GAME-1',
    serviceType: 'game',
    location: 'Германия',
    locationKey: 'germany',
    price: 89,
    discount: 10,
    metadata: {
      cpu: '225%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '2 ГБ DDR4',
      disk: '32 ГБ NVMe',
      ports: 5,
      databases: 3,
      backups: 1,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '63dc7603-4e7f-4fb9-8c04-06cee068759b',
    name: 'GAME-2',
    serviceType: 'game',
    location: 'Германия',
    locationKey: 'germany',
    price: 229,
    discount: 10,
    metadata: {
      cpu: '400%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '4 ГБ DDR4',
      disk: '32 ГБ NVMe',
      ports: 10,
      databases: 5,
      backups: 2,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '1ee7af6b-09aa-4b06-b9bb-b236f4bd0f2a',
    name: 'GAME-3',
    serviceType: 'game',
    location: 'Германия',
    locationKey: 'germany',
    price: 339,
    discount: 10,
    metadata: {
      cpu: '500%',
      cpu_model: 'Ryzen 9 3900x',
      ram: '6 ГБ DDR4',
      disk: '96 ГБ NVMe',
      ports: 15,
      databases: 10,
      backups: 5,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '02ed9186-c842-4872-88ef-7c2556c88024',
    name: 'GAME-1',
    serviceType: 'game',
    location: 'Москва',
    locationKey: 'moscow',
    price: 139,
    discount: 10,
    metadata: {
      cpu: '225%',
      cpu_model: 'Ryzen 9 5900x',
      ram: '2 ГБ DDR4',
      disk: '32 ГБ NVMe',
      ports: 5,
      databases: 3,
      backups: 1,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
  {
    id: '8bd217d0-6a3e-41b0-b366-cc95ddcd1b05',
    name: 'GAME-2',
    serviceType: 'game',
    location: 'Москва',
    locationKey: 'moscow',
    price: 329,
    discount: 10,
    metadata: {
      cpu: '400%',
      cpu_model: 'Ryzen 9 5900x',
      ram: '4 ГБ DDR4',
      disk: '32 ГБ NVMe',
      ports: 10,
      databases: 5,
      backups: 2,
      antiddos: 'AntiDDoS L3-L7',
      network_speed: '1 Gbit/s',
    },
  },
];
