/* eslint-disable @typescript-eslint/naming-convention */
import { resolve } from "dns";
import Docker from "dockerode";
import { DockerContainer } from "./interfaces";

export default class DockerManager {
  private containers: Docker.ContainerInfo[] | null = null;

  constructor(private docker: Docker) {}

  public async getContainerByName(
    containerName: String
  ): Promise<DockerContainer> {
    try {
      if (this.containers === null) {
        this.containers = await this.docker.listContainers();
      }
    } catch (error) {
      throw error;
    }
    const container = this.containers.find(
      (container) =>
        container.Names.find((name) =>
          new RegExp(`${containerName}`).test(name)
        ) !== undefined
    );

    if (!container) {
      throw new Error(`Container ${containerName} not found`);
    }

    return {
      id: container.Id,
      names: container.Names,
      image: container.Image,
      state: container.State,
      status: container.Status,
      mounts: container.Mounts.map((mount) => ({
        name: mount.Name,
        type: mount.Type,
        source: mount.Source,
        destination: mount.Destination,
      })),
    };
  }

  public parseToContainerPath(
    container: DockerContainer,
    filePath: string
  ): string {
    let path = null;
    container.mounts.some((mount) => {
      const result = filePath.replace(mount.source, "");
      if (result !== filePath) {
        path = `${mount.destination}${result}`;
        return true;
      }
    });

    if (path === null) {
      throw new Error(`Can't find the path inside container for ${filePath}`);
    }

    return path;
  }

  public execute(
    container: DockerContainer,
    command: string[]
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const exec = await this.docker.getContainer(container.id).exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: command,
        Env: ["PHP_CS_FIXER_IGNORE_ENV=true"],
        Tty: false,
      });
      const readerStream = await exec.start({ hijack: true, stdin: true });
      let data = "";
      readerStream.setEncoding("UTF8");
      readerStream.on("data", (chunk) => (data += chunk));
      readerStream.on("end", () => resolve(data));
      readerStream.on("error", (err) => reject(err.stack));
    });
  }
}
