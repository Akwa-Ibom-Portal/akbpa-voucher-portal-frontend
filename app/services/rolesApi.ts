import type { Role } from '~/types'

export async function listRoles(): Promise<Role[]> {
  const { http } = useHttp()
  const { data } = await http.get('/roles')
  const body = data.data ?? data
  const roles = body.roles ?? body
  return roles.map((r: any) => ({ id: String(r.id), name: r.name, description: r.description }))
}
