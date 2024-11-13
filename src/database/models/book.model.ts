import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'books', //for database table name
  modelName: 'Book', //for model name
})
class Book extends Model {
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

export default Book;
