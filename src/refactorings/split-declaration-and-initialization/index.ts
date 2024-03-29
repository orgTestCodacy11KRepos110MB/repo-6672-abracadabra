import {
  createVisitor,
  splitDeclarationAndInitialization
} from "./split-declaration-and-initialization";

import { RefactoringWithActionProvider } from "../../types";

const config: RefactoringWithActionProvider = {
  command: {
    key: "splitDeclarationAndInitialization",
    operation: splitDeclarationAndInitialization,
    title: "Split Declaration and Initialization"
  },
  actionProvider: {
    message: "Split declaration and initialization",
    createVisitor
  }
};

export default config;
