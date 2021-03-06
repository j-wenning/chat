import { createStore } from 'vuex'
import { randInt } from '@/scripts/random.ts'

interface User {
  id: number;
  avatar: string;
  name: string;
}

interface State {
  users: User[];
  isMediumToggled: boolean;
  isUsersToggled: boolean;
  isSettingsToggled: boolean;
}

enum Mutations {
  setMedium = 'setMedium',
  toggleUsers = 'toggleUsers',
  toggleSettings = 'toggleSettings'
}

const fakeString = (minLength: number, maxLength: number): string =>
  [...Array(randInt(minLength, maxLength))].map(() => String.fromCharCode(randInt(32, 126))).join('')

const fakeUsers = [...Array(35)].map((_, id) => ({ id, avatar: '', name: fakeString(2, 36) }))

export default createStore({
  state: {
    users: fakeUsers,
    isMediumToggled: false,
    isUsersToggled: false,
    isSettingsToggled: false
  },
  mutations: {
    setMedium: (state: State, payload: boolean): void => { state.isMediumToggled = payload },
    toggleUsers: (state: State): void => { state.isUsersToggled = !state.isUsersToggled },
    toggleSettings: (state: State): void => { state.isSettingsToggled = !state.isSettingsToggled }
  },
  actions: {
    updateFormInput: (): void => undefined,
    setMedium: ({ commit }, payload: boolean): void => commit(Mutations.setMedium, payload),
    toggleUsers: ({ commit }): void => commit(Mutations.toggleUsers),
    toggleSettings: ({ commit }): void => commit(Mutations.toggleSettings)
  },
  getters: {
    users: (state: State): Array<User> => state.users,
    isMediumToggled: (state: State): boolean => state.isMediumToggled,
    isUsersToggled: (state: State): boolean => state.isUsersToggled,
    isSettingsToggled: (state: State): boolean => state.isSettingsToggled
  },
  modules: {
  }
})
