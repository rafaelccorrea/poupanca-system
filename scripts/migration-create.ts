import { exec } from 'shelljs';

async function create(name: string) {
  exec(
    `typeorm-ts-node-commonjs migration:create src/database/migrations/${name}`,
  );
}

create(process.argv[2]);
