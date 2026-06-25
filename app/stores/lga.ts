import { defineStore } from 'pinia'
import type { Lga, Ward } from '~/types'
import * as lgaApi from '~/services/lgaApi'

export const useLgaStore = defineStore('lga', () => {
  const lgas = ref<Lga[]>([])
  const wards = ref<Ward[]>([])
  const loaded = ref(false)

  async function ensureLoaded() {
    if (loaded.value) return
    lgas.value = await lgaApi.listLgas()
    wards.value = await lgaApi.listWards()
    loaded.value = true
  }

  function wardsForLga(lgaId: string) {
    return wards.value.filter(w => w.lgaId === lgaId)
  }

  function lgaName(id: string) {
    return lgas.value.find(l => l.id === id)?.name ?? ''
  }

  function wardName(id: string) {
    return wards.value.find(w => w.id === id)?.name ?? ''
  }

  return { lgas, wards, loaded, ensureLoaded, wardsForLga, lgaName, wardName }
})
