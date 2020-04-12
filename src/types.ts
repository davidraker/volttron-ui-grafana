export interface SimpleOptions {
  web_address: string;
  username: string;
  password: string;
  api_token: string;
  platform: string;
  platforms: string[];
  device: string;
  devices: string[];
  point: string;
  points: string[];
  input: string;
  showPath: boolean;
}

export const defaults: SimpleOptions = {
  web_address: 'https://alfred:8443',
  username: '',
  password: '',
  api_token: '',
  platform: '',
  platforms: [],
  device: '',
  devices: [],
  point: '',
  points: [],
  input: '',
  showPath: true,
};
