import { jest, beforeEach } from '@jest/globals'
import { mockDeep, mockReset } from 'jest-mock-extended'
import prisma from '../src/db/db.js'

jest.unstable_mockModule('../src/db/db.js', () => ({
    default: prismaMock
}))

export const prismaMock = mockDeep()

beforeEach(() => {
    mockReset(prismaMock)
})