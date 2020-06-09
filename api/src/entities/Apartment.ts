import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import is from 'utils/validation';
@Entity()
class Apartment extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    // TODO add validations
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int8')
  size: number;

  @Column('int8', { nullable: true })
  room_nr: number;

  @Column('int8')
  price: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('int8')
  owner_id: number;

  @Column('varchar')
  rental_status: 'RENTED' | 'AVAILABLE';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

export default Apartment;
