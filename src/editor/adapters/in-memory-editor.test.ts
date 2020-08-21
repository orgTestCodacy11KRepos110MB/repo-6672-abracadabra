import { createEditorContractTests } from "../editor-contract-test";
import { Position } from "../position";

import { InMemoryEditor } from "./in-memory-editor";

describe("InMemory Editor", () => {
  createEditorContractTests((code, position = new Position(0, 0)) => {
    const editor = new InMemoryEditor(code, position);
    return [editor, () => ({ code: editor.code, position: editor.position })];
  });
});
