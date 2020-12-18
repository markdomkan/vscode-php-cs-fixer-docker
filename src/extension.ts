import * as vscode from "vscode";
import { Formatter } from "./main";
import { Settings } from "./interfaces";
import DockerManager from "./DockerManager";
import Dockerode from "dockerode";

let formatter: Formatter | null = null;

function formaterFactory() {
  const settings = (vscode.workspace.getConfiguration(
    "php-cs-docker"
  ) as unknown) as Settings;
  const dockerManager = new DockerManager(new Dockerode());
  return new Formatter(settings, dockerManager);
}

export function activate() {
  const outputChanel = vscode.window.createOutputChannel("PHP cs docker");

  vscode.languages.registerDocumentFormattingEditProvider("php", {
    async provideDocumentFormattingEdits(document: vscode.TextDocument) {
      try {
        if (formatter === null) {
          formatter = formaterFactory();
          outputChanel.appendLine("Formatter object created");
        }
        const result = (await formatter.format(document.uri.path)).replace(
          /[\u0002,\u0000,�]/gi,
          ""
        );
        outputChanel.appendLine(result);
        return null;
      } catch (error) {
        formatter = null;
        vscode.window.showErrorMessage(error.message);
      }
    },
  });
}

export function deactivate() {}
