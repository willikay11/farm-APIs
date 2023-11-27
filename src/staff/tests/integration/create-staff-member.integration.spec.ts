import { IntegrationTestManager } from '../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';
import { StaffMemberStub } from '../stubs/staffMember.stub';

describe('create staff member', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('given that a staff member does not exist', () => {
    describe('when a createMember mutation is executed', () => {
      let createdStaffMember: StaffMember;

      beforeAll(async () => {
        const response = await request<{ createMember: StaffMember }>(
          integrationTestManager.httpServer,
        )
          .mutate(gql`
            mutation CreateMember($createStaffMember: CreateStaffMember!) {
              createMember(createStaffMember: $createStaffMember) {
                id
                idNumber
                type
              }
            }
          `)
          .variables({
            createStaffMember: {
              name: StaffMemberStub.name,
              type: StaffMemberStub.type,
              idNumber: StaffMemberStub.idNumber,
            },
          })
          .expectNoErrors();
        createdStaffMember = response.data?.createMember;
      });

      test('the response should be the newly created staff member', () => {
        expect(createdStaffMember).toMatchObject({
          idNumber: StaffMemberStub.idNumber,
        });
      });
    });
  });
});
