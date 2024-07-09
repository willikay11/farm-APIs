import { IntegrationTestManager } from '../../../../test/integrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { BlockStub, EditBlockStub } from '../stubs/block.stub';
import { Block } from '../../entities/block.entity';

describe('block service', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  describe('create', () => {
    describe('given that a block does not exist', () => {
      describe('when the createBlock mutation is executed', () => {
        let createdBlock: Block;

        beforeAll(async () => {
          const response = await request<{ createBlock: Block }>(
            integrationTestManager.httpServer,
          )
            .mutate(gql`
              mutation CreateBlock($name: String!, $owner: Float!) {
                createBlock(block: { name: $name, owner: $owner }) {
                  id
                  name
                  owner
                  createdAt
                  updatedAt
                }
              }
            `)
            .variables({
              name: BlockStub.name,
              owner: BlockStub.owner,
            })
            .expectNoErrors();
          createdBlock = response.data?.createBlock;
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
            .mutate(gql`
              mutation EditBlock($id: Float!, $name: String!, $owner: Float!) {
                editBlock(id: $id, block: { name: $name, owner: $owner }) {
                  id
                  name
                  owner
                }
              }
            `)
            .variables({
              id: EditBlockStub.id,
              name: EditBlockStub.name,
              owner: EditBlockStub.owner,
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
    describe('given that there exists staff members', () => {
      describe('when getBlocks query is executed', () => {
        let blocks: Block[];

        beforeAll(async () => {
          const response = await request<{ getBlocks: Block[] }>(
            integrationTestManager.httpServer,
          )
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
            .query(gql`
              query ($id: Float!) {
                getBlock(id: $id) {
                  id
                  name
                  owner
                }
              }
            `)
            .variables({
              id: EditBlockStub.id,
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
            .mutate(gql`
              mutation DeactivateBlock($id: Float!) {
                deactivate(id: $id) {
                  id
                }
              }
            `)
            .variables({
              id: EditBlockStub.id,
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
