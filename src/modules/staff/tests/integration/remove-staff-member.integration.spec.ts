import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';
import { EditStaffMemberStub } from '../stubs/staffMember.stub';

describe('deactivate a staff member', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('given that a staff member does exist', () => {
    describe('when an deactivate mutation is executed', () => {
      let deactivatedStaff: StaffMember;

      beforeAll(async () => {
        const response = await request<{ deactivate: StaffMember }>(
          integrationTestManager.httpServer,
        )
          .mutate(gql`
            mutation DeactivateStaff($id: String!) {
              deactivate(id: $id) {
                id
              }
            }
          `)
          .variables({
            id: EditStaffMemberStub.id,
          })
          .expectNoErrors();
        deactivatedStaff = response.data?.deactivate;
      });

      test('the response should be null', () => {
        expect(deactivatedStaff).toMatchObject({
          id: null,
        });
      });
    });
  });
});
