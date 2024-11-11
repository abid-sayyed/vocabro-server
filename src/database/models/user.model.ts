import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({
  tableName: 'user',
  modelName: 'User',
  paranoid: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare _id: string;

  @Index('idx_username')
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Index('idx_email')
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column(DataType.STRING(500))
  declare refresh_token: string;

  @Column({
    type: DataType.ENUM('superadmin', 'organization', 'user'),
    defaultValue: 'user',
  })
  declare role: 'superadmin' | 'organization' | 'user';

  @Column({
    type: DataType.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active',
  })
  declare status: 'active' | 'inactive' | 'banned';

  @Column(DataType.DATE)
  declare last_login: Date;

  @Column(DataType.DATE)
  declare last_logout: Date;

  @BeforeUpdate
  @BeforeCreate
  static async hashPasswordBeforeCreate(user: User) {
    if (user.password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  async validatePassword(
    instance: User,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, instance.password);
  }
}

export default User;
