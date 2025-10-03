import type { User } from 'firebase/auth'

/**
 * Firebase User型の完全なモックを作成するヘルパー
 */
export const createMockUser = (overrides: Partial<User> = {}): User => {
  const defaultUser: User = {
    uid: 'test-uid',
    email: 'test@example.com',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: '2024-01-01T00:00:00.000Z',
      lastSignInTime: '2024-01-01T00:00:00.000Z',
    },
    providerData: [],
    refreshToken: 'test-refresh-token',
    tenantId: null,
    delete: vi.fn().mockResolvedValue(undefined),
    getIdToken: vi.fn().mockResolvedValue('test-id-token'),
    getIdTokenResult: vi.fn().mockResolvedValue({
      token: 'test-id-token',
      authTime: '2024-01-01T00:00:00.000Z',
      issuedAtTime: '2024-01-01T00:00:00.000Z',
      expirationTime: '2024-01-02T00:00:00.000Z',
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {},
    }),
    reload: vi.fn().mockResolvedValue(undefined),
    toJSON: vi.fn().mockReturnValue({}),
    displayName: null,
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  }

  return { ...defaultUser, ...overrides }
}
