import { defineStore } from 'pinia'
import type { ProgrammeCycle } from '~/types'
import * as programmeCyclesApi from '~/services/programmeCyclesApi'

export const useProgrammeCyclesStore = defineStore('programmeCycles', () => {
  const cycles = ref<ProgrammeCycle[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchCycles() {
    loading.value = true
    error.value = ''
    try {
      cycles.value = await programmeCyclesApi.listProgrammeCycles()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load programme cycles'
    } finally {
      loading.value = false
    }
  }

  function replace(updated: ProgrammeCycle) {
    const i = cycles.value.findIndex(c => c.id === updated.id)
    if (i !== -1) cycles.value[i] = updated
  }

  async function createCycle(dto: programmeCyclesApi.CreateProgrammeCycleDto) {
    const created = await programmeCyclesApi.createProgrammeCycle(dto)
    cycles.value.unshift(created)
    return created
  }

  async function updateCycle(id: string, dto: programmeCyclesApi.UpdateProgrammeCycleDto) {
    const updated = await programmeCyclesApi.updateProgrammeCycle(id, dto)
    replace(updated)
    return updated
  }

  async function activateCycle(id: string) {
    const updated = await programmeCyclesApi.activateProgrammeCycle(id)
    // Activating one cycle deactivates the others from the UI's point of view too.
    cycles.value = cycles.value.map(c => ({ ...c, isActive: c.id === updated.id }))
    replace(updated)
    return updated
  }

  return { cycles, loading, error, fetchCycles, createCycle, updateCycle, activateCycle }
})
