import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createFilme1627510918981 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: 'Filmes',
			columns: [
				{
					name: 'id',
					type: 'integer',
					unsigned: true,
					isPrimary: true,
					isGenerated: true,
					generationStrategy: 'increment'
				},
				{
					name: 'nome',
					type: 'varchar',
					isUnique: true
				},
				{
					name: 'diretor',
					type: 'varchar'
				},
				{
					name: 'ano_de_lancamento',
					type: 'integer'
				},
				{
					name: 'genero_id',
					type: 'integer'
				}
			],
			foreignKeys: [
				{
					name: 'GeneroFilme',
					columnNames: ['genero_id'],
					referencedTableName: 'Generos',
					referencedColumnNames: ['id'],
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE'
				}
			]
		}))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('Filmes')
  }
}
