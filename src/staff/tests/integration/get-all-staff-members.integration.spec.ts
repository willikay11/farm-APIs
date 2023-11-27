import { IntegrationTestManager } from '../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';

describe('get all staff members', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('given that there exists staff members', () => {
    describe('when getStaffMembers query is executed', () => {
      let staffMembers: [StaffMember];

      beforeAll(async () => {
        const response = await request<any>(integrationTestManager.httpServer)
          .query(gql`
            {
              getStaffMembers {
                id
                name
                idNumber
                createdAt
              }
            }
          `)
          .expectNoErrors();
        staffMembers = response.data?.getStaffMembers;
      });

      test('the response should have at least one record', () => {
        expect(staffMembers.length).toBeGreaterThan(0);
      });
    });
  });
});
