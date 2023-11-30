import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';
import { EditStaffMemberStub } from '../stubs/staffMember.stub';

describe('edit staff member', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('given that a staff member does exist', () => {
    describe('when an editMember mutation is executed', () => {
      let createdStaffMember: StaffMember;

      beforeAll(async () => {
        const response = await request<{ editMember: StaffMember }>(
          integrationTestManager.httpServer,
        )
          .mutate(gql`
            mutation EditStaffMember(
              $id: Float!
              $type: String!
              $idNumber: String!
              $name: String!
            ) {
              editMember(
                id: $id
                member: { name: $name, idNumber: $idNumber, type: $type }
              ) {
                id
                idNumber
                type
              }
            }
          `)
          .variables({
            id: EditStaffMemberStub.id,
            name: EditStaffMemberStub.name,
            type: EditStaffMemberStub.type,
            idNumber: EditStaffMemberStub.idNumber,
          })
          .expectNoErrors();
        createdStaffMember = response.data?.editMember;
      });

      test('the response should be the edited staff member', () => {
        expect(createdStaffMember).toMatchObject({
          idNumber: EditStaffMemberStub.idNumber,
        });
      });
    });
  });
});
