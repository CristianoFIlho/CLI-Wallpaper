export interface Command {
  name: string;
  description: string;
}

export interface Section {
  title: string;
  commands: Command[];
}

export interface CLIData {
  title: string;
  sections: Section[];
}

export interface Resolution {
  width: number;
  height: number;
  name: string;
}

export const RESOLUTIONS: Resolution[] = [
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 2560, height: 1440, name: '2560x1440' },
  { width: 3840, height: 2160, name: '3840x2160' }
];
