const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');

let testEnv;

before(async () => {
  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: 'toolshub-87859',
    firestore: {
      rules: fs.readFileSync('../firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  // Clear the database between tests
  await testEnv.clearFirestore();
});

after(async () => {
  // Cleanup the test environment after all tests
  await testEnv.cleanup();
});

describe('ToolsHub Firestore Security Rules', () => {

  it('should allow authenticated users to write to their own profile', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(alice.firestore().doc('users/alice').set({ name: 'Alice' }));
  });

  it('should deny authenticated users from writing to another user profile', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(alice.firestore().doc('users/bob').set({ name: 'Bob' }));
  });

  it('should deny unauthenticated users from writing to any profile', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(unauthed.firestore().doc('users/alice').set({ name: 'Alice' }));
  });

  it('should allow authenticated users to read their own conversations', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(alice.firestore().doc('users/alice/conversations/chat1').get());
  });

  it('should deny authenticated users from reading another users conversations', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(alice.firestore().doc('users/bob/conversations/chat1').get());
  });

});
