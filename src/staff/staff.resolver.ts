import { Args, Query, Resolver } from '@nestjs/graphql';
import { Staff } from './staff.model';

@Resolver()
export class StaffResolver {
  constructor() {}

  @Query(() => Staff)
  async staffMember(@Args('id') id: string) {
    console.log('id: ', id);
    return {
      id: '1',
      name: 'Will',
      idNumber: '901293013',
    };
  }
}
