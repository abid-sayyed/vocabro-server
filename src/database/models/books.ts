import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'books',
  modelName: 'Books',
}) // Optional: specify the table name
class Books extends Model {
  @Column({
    primaryKey: true, // Explicitly stating primary key as a parameter
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.STRING)
  declare fileName: string;

  @Column(DataType.STRING)
  declare fileURL: string;
}

export default Books;
