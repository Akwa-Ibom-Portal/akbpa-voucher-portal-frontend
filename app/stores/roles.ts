import { defineStore } from 'pinia'
import type { Role } from '~/types'
import * as rolesApi from '~/services/rolesApi'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Role[]>([])
  const loaded = ref(false)

  async function ensureLoaded() {
    if (loaded.value) return
    roles.value = await rolesApi.listRoles()
    loaded.value = true
  }

  return { roles, loaded, ensureLoaded }
})
