import { exec } from 'shelljs';

async function generate(name: string) {
  exec(
    `yarn typeorm migration:generate src/database/migrations/${name} --pretty`,
  );
}

generate(process.argv[2]);
