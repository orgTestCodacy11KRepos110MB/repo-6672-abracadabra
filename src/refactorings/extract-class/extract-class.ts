import { Editor, ErrorReason } from "../../editor/editor";
import { Selection } from "../../editor/selection";
import * as t from "../../ast";

// REFACTOR: this refactoring wasn't implemented following the usual pattern. See https://github.com/nicoespeon/abracadabra/issues/180

export async function extractClass(editor: Editor) {
  const { code, selection } = editor;
  const updatedCode = updateCode(t.parse(code), selection);

  if (!updatedCode.hasCodeChanged) {
    editor.showError(ErrorReason.CanNotExtractClass);
    return;
  }

  await editor.write(updatedCode.code);
}

function updateCode(ast: t.AST, selection: Selection): t.Transformed {
  return t.transformAST(
    ast,
    createVisitor(selection, (_path) => {
      // TODO: implement the transformation here 🧙 https://github.com/nicoespeon/abracadabra/issues/180‍
    })
  );
}

export function createVisitor(
  _selection: Selection,
  _onMatch: (path: t.NodePath) => void
): t.Visitor {
  // TODO: implement the check here 🧙 https://github.com/nicoespeon/abracadabra/issues/180‍
  return {};
}
