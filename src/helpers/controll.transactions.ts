import { Connection } from 'typeorm';

export async function transactionsControll(
  operation: () => Promise<any>,
  connection: Connection,
) {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await operation();
    await queryRunner.commitTransaction();
    return result;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
}
