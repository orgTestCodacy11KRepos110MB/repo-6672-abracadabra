import { Code } from "../../editor/i-write-code";
import { Selection } from "../../editor/selection";
import {
  ShowErrorMessage,
  ErrorReason
} from "../../editor/i-show-error-message";
import { createWriteInMemory } from "../../editor/adapters/write-code-in-memory";
import { testEach } from "../../tests-helpers";
import { convertToTemplateLiteral } from "./convert-to-template-literal";

describe("Convert To Template Literal", () => {
  let showErrorMessage: ShowErrorMessage;

  beforeEach(() => {
    showErrorMessage = jest.fn();
  });

  testEach<{ code: Code; selection?: Selection; expected: Code }>(
    "should convert to template literal",
    [
      {
        description: "a simple string",
        code: `const name = "Jane";`,
        expected: "const name = `Jane`;"
      },
      {
        description: "only selected string",
        code: `const name = "Jane";
const lastName = "Doe";`,
        expected: `const name = \`Jane\`;
const lastName = "Doe";`
      },
      {
        description: "concatenation with number, cursor on string",
        code: `const name = "Jane" + 1;`,
        expected: "const name = `Jane1`;"
      },
      {
        description: "concatenation with number, cursor on the other node",
        code: `const name = "Jane-" + 1;`,
        selection: Selection.cursorAt(0, 23),
        expected: "const name = `Jane-1`;"
      },
      {
        description: "concatenation with number, cursor on operator",
        code: `const name = "Jane-" + 1;`,
        selection: Selection.cursorAt(0, 20),
        expected: "const name = `Jane-1`;"
      },
      {
        description: "concatenation with boolean",
        code: `const name = "Jane-" + true;`,
        expected: "const name = `Jane-true`;"
      },
      {
        description: "concatenation with another string",
        code: `const name = "Jane-" + "Doe";`,
        expected: "const name = `Jane-Doe`;"
      },
      {
        description: "concatenation with another template literal",
        code: `const name = "Jane-" + \`Doe-\${12}\`;`,
        expected: "const name = `Jane-Doe-${12}`;"
      },
      {
        description: "concatenation with null",
        code: `const name = "Jane-" + null;`,
        expected: "const name = `Jane-null`;"
      },
      {
        description: "concatenation with undefined",
        code: `const name = "Jane-" + undefined;`,
        expected: "const name = `Jane-undefined`;"
      },
      {
        description: "concatenation with call expression",
        code: `const name = "Jane-" + getLastNameOf(jane);`,
        expected: "const name = `Jane-${getLastNameOf(jane)}`;"
      },
      {
        description: "concatenation with member expression",
        code: `const name = "Jane-" + lastNames[1];`,
        expected: "const name = `Jane-${lastNames[1]}`;"
      },
      {
        description: "concatenation with identifier",
        code: `const lastName = "Doe";
const name = "Jane " + lastName;`,
        selection: Selection.cursorAt(1, 20),
        expected: `const lastName = "Doe";
const name = \`Jane \${lastName}\`;`
      },
      {
        description: "concatenation with many elements",
        code: `const lastName = "Doe";
const age = 30;
const name = "Jane " + lastName + " / " + age;`,
        selection: Selection.cursorAt(2, 20),
        expected: `const lastName = "Doe";
const age = 30;
const name = \`Jane \${lastName} / \${age}\`;`
      }
    ],
    async ({ code, selection = Selection.cursorAt(0, 13), expected }) => {
      const result = await doConvertToTemplateLiteral(code, selection);

      expect(result).toBe(expected);
    }
  );

  testEach<{ code: Code; selection?: Selection }>(
    "should not convert",
    [
      {
        description: "other binary expression operators",
        code: `const name = "Jane" - 12 + " Doe";`
      },
      {
        description: "binary expression without string",
        code: "const total = price + 10 + 20;"
      }
    ],
    async ({ code, selection = Selection.cursorAt(0, 14) }) => {
      const result = await doConvertToTemplateLiteral(code, selection);

      expect(result).toBe(code);
    }
  );

  it("should show an error message if refactoring can't be made", async () => {
    const code = `// This is a comment, can't be refactored`;
    const selection = Selection.cursorAt(0, 0);

    await doConvertToTemplateLiteral(code, selection);

    expect(showErrorMessage).toBeCalledWith(
      ErrorReason.DidNotFoundStringToConvert
    );
  });

  async function doConvertToTemplateLiteral(
    code: Code,
    selection: Selection
  ): Promise<Code> {
    const [write, getState] = createWriteInMemory(code);
    await convertToTemplateLiteral(code, selection, write, showErrorMessage);
    return getState().code;
  }
});
