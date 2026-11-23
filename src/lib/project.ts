import { useApp } from '../store/app'
import { sceneState } from './sceneState'
import { tick } from './audio'

/** Open the full-screen project experience and sync the URL (#work/<id>). */
export function openProject(id: string) {
  sceneState.pulse = 1
  tick(520)
  history.pushState({ project: id }, '', `#work/${id}`)
  useApp.getState().setProjectId(id)
}

export function closeProject() {
  if (history.state && history.state.project) {
    history.back() // popstate handler clears the store
  } else {
    history.replaceState(null, '', '#work')
    useApp.getState().setProjectId(null)
  }
}

export function projectIdFromHash(hash: string): string | null {
  const m = /^#work\/([\w-]+)$/.exec(hash)
  return m ? m[1] : null
}

/** Swap the open project without growing the history stack (prev / next inside the overlay). */
export function switchProject(id: string) {
  history.replaceState({ project: id }, '', `#work/${id}`)
  useApp.getState().setProjectId(id)
}
