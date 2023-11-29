import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';
import {
  EditStaffMemberStub,
  StaffMemberStub,
} from '../stubs/staffMember.stub';

describe('get single staff member', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('given that there exists a staff member', () => {
    describe('when staffMember query is executed', () => {
      let staffMember: StaffMember;

      beforeAll(async () => {
        const response = await request<{ staffMember: StaffMember }>(
          integrationTestManager.httpServer,
        )
          .query(gql`
            {
              staffMember(id: "1") {
                id
                name
                idNumber
              }
            }
          `)
          .variables({
            id: EditStaffMemberStub.id,
          })
          .expectNoErrors();
        staffMember = response.data?.staffMember;
      });

      test('the response should have at least one record', () => {
        expect(staffMember).toMatchObject({
          idNumber: EditStaffMemberStub.idNumber,
        });
      });
    });
  });
});
