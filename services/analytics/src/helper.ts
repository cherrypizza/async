import * as fs from 'fs';
import * as path from 'path';
import * as avro from 'avsc';

export function validateEvent(
  data: any,
  eventPath: string,
  version: number,
): boolean {
  const schemaPath = path.resolve(
    path.join(
      '../schema-registry',
      ...eventPath.split('.'),
      version.toString(),
    ),
  );
  const schema = fs.readFileSync(`${schemaPath}.json`, 'utf-8');
  const schemaData = JSON.parse(schema);
  const type = avro.Type.forSchema(schemaData as avro.Schema);

  return type.isValid(data);
}
