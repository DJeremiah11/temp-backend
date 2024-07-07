import { makeSchema } from "nexus";

import path from "path";
import * as types from './types';


export const getSchema = () => {
  const schema = makeSchema({
    types,
    outputs: {
      // I tend to use `.gen` to denote "auto-generated" files, but this is not a requirement.
      schema: path.join(__dirname, "generated/schema.gen.graphql"),
      typegen: path.join(__dirname, "generated/nexusTypes.gen.ts"),
    },
    contextType: {
      module: require.resolve("./context"),
      export: "Context",
    },
  });

  return schema;
};
