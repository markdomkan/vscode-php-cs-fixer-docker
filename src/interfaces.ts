export interface Settings {
  containerName: string;
}

export interface DockerContainer {
  id: string;
  names: string[];
  image: string;
  state: string;
  status: string;
  mounts: DockerMount[];
}

export interface DockerMount {
  name?: string;
  type: string;
  source: string;
  destination: string;
}
