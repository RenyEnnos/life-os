// @vitest-environment node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../app'
import { FileBackedAuthRepository } from '../authRepository'
import { FileBackedMvpRepository } from '../mvpRepository'

describe.sequential('server-authorized MVP admin overview', () => {
  const mvpFile = path.join(os.tmpdir(), `lifeos-admin-mvp-${Date.now()}.json`)
  const authFile = path.join(os.tmpdir(), `lifeos-admin-auth-${Date.now()}.json`)
  const previousAdmins = process.env.LIFEOS_ADMIN_EMAILS

  beforeEach(async () => {
    process.env.LIFEOS_ADMIN_EMAILS = 'admin@example.test'
    await fs.rm(mvpFile, { force: true })
    await fs.rm(authFile, { force: true })
  })

  afterEach(async () => {
    if (previousAdmins === undefined) delete process.env.LIFEOS_ADMIN_EMAILS
    else process.env.LIFEOS_ADMIN_EMAILS = previousAdmins
    await fs.rm(mvpFile, { force: true })
    await fs.rm(authFile, { force: true })
  })

  function app(repository = new FileBackedMvpRepository(mvpFile)) {
    return createApp(
      repository,
      new FileBackedAuthRepository(authFile, [
        { email: 'admin@example.test', code: 'ADMIN-INVITE' },
        { email: 'member@example.test', code: 'MEMBER-INVITE' },
      ]),
    )
  }

  async function register(client: ReturnType<typeof request.agent>, email: string, inviteCode: string) {
    const response = await client.post('/api/auth/register').send({
      email,
      password: 'Password123!',
      name: email.startsWith('admin') ? 'Admin' : 'Member',
      inviteCode,
    })
    expect(response.status).toBe(201)
    return response.body.user.id as string
  }

  it('denies unauthenticated and ordinary invited users', async () => {
    const server = app()
    expect((await request(server).get('/api/mvp/admin/overview')).status).toBe(401)

    const member = request.agent(server)
    await register(member, 'member@example.test', 'MEMBER-INVITE')
    expect((await member.get('/api/mvp/admin/overview')).status).toBe(403)
  })

  it('returns only analytics, events, and feedback to an allowlisted administrator', async () => {
    const repository = new FileBackedMvpRepository(mvpFile)
    const admin = request.agent(app(repository))
    const adminId = await register(admin, 'admin@example.test', 'ADMIN-INVITE')
    await repository.submitFeedback(adminId, { rating: 4, message: 'Useful signal.' })
    const overview = await admin.get('/api/mvp/admin/overview')

    expect(overview.status).toBe(200)
    expect(Object.keys(overview.body.data).sort()).toEqual(['analytics', 'events', 'feedback'])
    expect(overview.body.data.feedback).toHaveLength(1)
    expect(overview.body.data.events.map((event: { type: string }) => event.type)).toContain('user_feedback_submitted')
  })

  it('does not expose a destructive admin reset operation', async () => {
    const admin = request.agent(app())
    await register(admin, 'admin@example.test', 'ADMIN-INVITE')

    expect((await admin.delete('/api/mvp/admin/overview')).status).toBe(404)
  })
})
