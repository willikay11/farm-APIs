import { Test, TestingModule } from '@nestjs/testing';
import { StaffResolver } from './staff.resolver';

describe('StaffResolver', () => {
  let resolver: StaffResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffResolver],
    }).compile();

    resolver = module.get<StaffResolver>(StaffResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
