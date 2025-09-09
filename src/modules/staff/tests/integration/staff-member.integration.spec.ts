import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { StaffMember } from '../../staff.model';
import {
  EditStaffMemberStub,
  StaffMemberStub,
} from '../stubs/staffMember.stub';

describe('staff service', () => {
  const integrationTestManager = new IntegrationTestManager();
  let authToken: string;
  let createdStaffMemberId: string;

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
    authToken = integrationTestManager.getAuthTokenForTestUser();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('create', () => {
    describe('given that a staff member does not exist', () => {
      describe('when a createMember mutation is executed', () => {
        let createdStaffMember: StaffMember;

        beforeAll(async () => {
          const response = await request<{ createMember: StaffMember }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
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
                retainer: StaffMemberStub.retainer,
                phoneNumber: StaffMemberStub.phoneNumber,
                huddleRate: StaffMemberStub.huddleRate,
                amountPerKg: StaffMemberStub.amountPerKg,
              },
            })
            .expectNoErrors();
          createdStaffMember = response.data?.createMember;
          createdStaffMemberId = response?.data?.createMember?.id;
        });

        test('the response should be the newly created staff member', () => {
          expect(createdStaffMember).toMatchObject({
            idNumber: StaffMemberStub.idNumber,
          });
        });
      });
    });
  });

  describe('find all', () => {
    describe('given that there exists staff members', () => {
      describe('when getStaffMembers query is executed', () => {
        let staffMembers: [StaffMember];

        beforeAll(async () => {
          const response = await request<any>(integrationTestManager.httpServer)
            .set('Authorization', `Bearer ${authToken}`)
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

  describe('find one', () => {
    describe('given that there exists a staff member', () => {
      describe('when staffMember query is executed', () => {
        let staffMember: StaffMember;

        beforeAll(async () => {
          const response = await request<{ staffMember: StaffMember }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .query(gql`
              query ($id: String!) {
                staffMember(id: $id) {
                  id
                  name
                  idNumber
                }
              }
            `)
            .variables({
              id: createdStaffMemberId,
            })
            .expectNoErrors();
          staffMember = response.data?.staffMember;
        });

        test('the response should have at least one record', () => {
          expect(staffMember).toMatchObject({
            name: StaffMemberStub.name,
          });
        });
      });
    });
  });

  describe('edit', () => {
    describe('given that a staff member does exist', () => {
      describe('when an editMember mutation is executed', () => {
        let createdStaffMember: StaffMember;

        beforeAll(async () => {
          const response = await request<{ editMember: StaffMember }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .mutate(gql`
              mutation EditStaffMember(
                $id: String!
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
              id: createdStaffMemberId,
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

  describe('remove', () => {
    describe('given that a staff member does exist', () => {
      describe('when an deactivate mutation is executed', () => {
        let deactivatedStaff: StaffMember;

        beforeAll(async () => {
          const response = await request<{ deactivate: StaffMember }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .mutate(gql`
              mutation DeactivateStaff($id: String!) {
                deactivate(id: $id) {
                  id
                }
              }
            `)
            .variables({
              id: createdStaffMemberId,
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
});
