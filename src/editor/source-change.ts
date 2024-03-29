import { Selection } from "./selection";

export interface SourceChange {
  readonly selection: Selection;
  applyToSelection(selection: Selection): Selection;
  modifies(selection: Selection): boolean;
}

export class DeleteSourceChange implements SourceChange {
  constructor(readonly selection: Selection) {}

  applyToSelection(selection: Selection): Selection {
    const { start, end, height } = this.selection;

    if (selection.end.isStrictlyBefore(start)) return selection;

    if (end.isStrictlyBefore(selection.start)) {
      const deletedOnSameLine = end.isSameLineThan(selection.start);
      const length = Math.max(end.character - start.character, 0);
      return Selection.fromPositions(
        selection.start
          .removeLines(height)
          .removeCharacters(deletedOnSameLine ? length : 0),
        selection.end
          .removeLines(height)
          .removeCharacters(
            deletedOnSameLine && selection.isOneLine ? length : 0
          )
      );
    }

    return selection;
  }

  modifies(selection: Selection): boolean {
    return this.selection.isInside(selection);
  }
}

export class AddSourceChange implements SourceChange {
  constructor(readonly selection: Selection) {}

  applyToSelection(selection: Selection): Selection {
    const { start, end, height } = this.selection;

    const changeIsBeforeSelection = start.isStrictlyBefore(selection.start);
    if (!changeIsBeforeSelection) return selection;

    const updateOnSameLine = start.isSameLineThan(selection.start);
    const length = Math.max(end.character - start.character, 0);
    return Selection.fromPositions(
      selection.start
        .addLines(height)
        .addCharacters(updateOnSameLine ? length : 0),
      selection.end
        .addLines(height)
        .addCharacters(updateOnSameLine && selection.isOneLine ? length : 0)
    );
  }

  modifies(selection: Selection): boolean {
    return this.selection.isInside(selection);
  }
}
