import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { BlockStub, EditBlockStub } from '../stubs/block.stub';
import { Block } from '../../entities/block.entity';

describe('block service', () => {
  const integrationTestManager = new IntegrationTestManager();
  let authToken: string;
  let createdBlockId: string;

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
    authToken = integrationTestManager.getAuthTokenForTestUser();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('create', () => {
    describe('given that a block does not exist', () => {
      describe('when the createBlock mutation is executed', () => {
        let createdBlock: Block;

        beforeAll(async () => {
          const response = await request<{ createBlock: Block }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .mutate(gql`
              mutation CreateBlock($name: String!, $noOfBushes: Int!) {
                createBlock(block: { name: $name, noOfBushes: $noOfBushes }) {
                  id
                  name
                  noOfBushes
                  owner
                  createdAt
                  updatedAt
                }
              }
            `)
            .variables({
              name: BlockStub.name,
              noOfBushes: BlockStub.noOfBushes,
            })
            .expectNoErrors();
          createdBlock = response.data?.createBlock;
          createdBlockId = createdBlock.id;
        });

        test('the response should be the newly created block', () => {
          expect(createdBlock).toMatchObject({
            name: BlockStub.name,
          });
        });
      });
    });
  });

  describe('edit', () => {
    describe('given that a block does exist', () => {
      describe('when the editBlock mutation is executed', () => {
        let createdBlock: Block;

        beforeAll(async () => {
          const response = await request<{ editBlock: Block }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .mutate(gql`
              mutation EditBlock(
                $id: String!
                $name: String!
                $noOfBushes: Int!
              ) {
                editBlock(
                  id: $id
                  block: { name: $name, noOfBushes: $noOfBushes }
                ) {
                  id
                  name
                  noOfBushes
                }
              }
            `)
            .variables({
              id: createdBlockId,
              name: EditBlockStub.name,
              noOfBushes: EditBlockStub.noOfBushes,
            })
            .expectNoErrors();
          createdBlock = response.data?.editBlock;
        });

        test('the response should be the edited block', () => {
          expect(createdBlock).toMatchObject({
            name: EditBlockStub.name,
          });
        });
      });
    });
  });

  describe('find all', () => {
    describe('given that there exists blocks', () => {
      describe('when getBlocks query is executed', () => {
        let blocks: Block[];

        beforeAll(async () => {
          const response = await request<{ getBlocks: Block[] }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .query(gql`
              {
                getBlocks {
                  id
                  name
                  owner
                  createdAt
                }
              }
            `)
            .expectNoErrors();
          blocks = response.data?.getBlocks;
        });

        test('the response should have at least one record', () => {
          expect(blocks.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('get one', () => {
    describe('given that there exists a block', () => {
      describe('when getBlock query is executed', () => {
        let block: Block;

        beforeAll(async () => {
          const response = await request<{ getBlock: Block }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .query(gql`
              query ($id: String!) {
                getBlock(id: $id) {
                  id
                  name
                  owner
                  noOfBushes
                }
              }
            `)
            .variables({
              id: createdBlockId,
            })
            .expectNoErrors();
          block = response.data?.getBlock;
        });

        test(`the response should have the name as ${EditBlockStub.name}`, () => {
          expect(block).toMatchObject({
            name: EditBlockStub.name,
          });
        });
      });
    });
  });

  describe('remove', () => {
    describe('given that a block does exist', () => {
      describe('when an deactivate mutation is executed', () => {
        let deactivatedBlock: Block;

        beforeAll(async () => {
          const response = await request<{ deactivate: Block }>(
            integrationTestManager.httpServer,
          )
            .set('Authorization', `Bearer ${authToken}`)
            .mutate(gql`
              mutation DeactivateBlock($id: String!) {
                deactivate(id: $id) {
                  id
                }
              }
            `)
            .variables({
              id: createdBlockId,
            })
            .expectNoErrors();
          deactivatedBlock = response.data?.deactivate;
        });

        test('the response should be null', () => {
          expect(deactivatedBlock).toMatchObject({
            id: null,
          });
        });
      });
    });
  });
});
