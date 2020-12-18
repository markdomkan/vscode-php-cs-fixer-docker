import DockerManager from "./DockerManager";
import { Settings } from "./interfaces";

export class Formatter {
  constructor(
    private settings: Settings,
    private dockerManager: DockerManager
  ) {
    if (this.settings.containerName === null) {
      throw new Error("Container name is not valid");
    }
  }

  public async format(filePath: string): Promise<string> {
    try {
      const container = await this.dockerManager.getContainerByName(
        this.settings.containerName
      );

      const pathInContainer = this.dockerManager.parseToContainerPath(
        container,
        filePath
      );

      return await this.dockerManager.execute(container, [
        "vendor/bin/php-cs-fixer",
        "fix",
        pathInContainer,
      ]);
    } catch (error) {
      throw error;
    }
  }
}
