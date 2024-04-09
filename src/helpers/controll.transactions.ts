import { Connection } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      },
      HttpStatus.BAD_REQUEST,
    );
  } finally {
    await queryRunner.release();
  }
}
