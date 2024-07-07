// scalars.ts
import { scalarType, } from 'nexus';
import { DateTimeScalar } from 'graphql-date-scalars';

export const DateTime = scalarType({
  name: 'DateTime',
  asNexusMethod: 'DateTime',
  parseValue: DateTimeScalar.parseValue,
  serialize: DateTimeScalar.serialize,
  parseLiteral: DateTimeScalar.parseLiteral,
});


