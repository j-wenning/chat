import { createStore } from 'vuex'
import { randInt } from '@/scripts/random.ts'

interface User {
  id: number;
  avatar: string;
  name: string;
}

interface State {
  users: User[];
  isUsersToggled: boolean;
  isSettingsToggled: boolean;
}

enum Mutations {
  toggleUsers = 'toggleUsers',
  toggleSettings = 'toggleSettings'
}

const fakeString = (minLength: number, maxLength: number): string =>
  [...Array(randInt(minLength, maxLength))].map(() => String.fromCharCode(randInt(32, 126))).join('')

const fakeUsers = [...Array(35)].map((_, id) => ({ id, avatar: '', name: fakeString(2, 36) }))

export default createStore({
  state: {
    users: fakeUsers,
    isUsersToggled: false,
    isSettingsToggled: false
  },
  mutations: {
    toggleUsers: (state: State): void => { state.isUsersToggled = !state.isUsersToggled },
    toggleSettings: (state: State): void => { state.isSettingsToggled = !state.isSettingsToggled }
  },
  actions: {
    updateFormInput: (): void => undefined,
    toggleUsers: ({ commit }): void => commit(Mutations.toggleUsers),
    toggleSettings: ({ commit }): void => commit(Mutations.toggleSettings)
  },
  getters: {
    users: (state: State): Array<User> => state.users,
    isUsersToggled: (state: State): boolean => state.isUsersToggled,
    isSettingsToggled: (state: State): boolean => state.isSettingsToggled
  },
  modules: {
  }
})
