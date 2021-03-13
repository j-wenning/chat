import { createStore } from 'vuex'
import { randInt } from '#/scripts/random'

interface User {
  id: number;
  avatar: string;
  name: string;
  email?: string;
}

interface State {
  users: User[];
  user: User;
  isMediumToggled: boolean;
  isUsersToggled: boolean;
  isSettingsToggled: boolean;
}

enum Mutations {
  updateUser = 'updateUser',
  setMedium = 'setMedium',
  toggleUsers = 'toggleUsers',
  toggleSettings = 'toggleSettings'
}

const fakeString = (minLength: number, maxLength: number): string =>
  [...Array(randInt(minLength, maxLength))].map(() => String.fromCharCode(randInt(32, 126))).join('')

const fakeUserCount = 35

const fakeUsers = [...Array(fakeUserCount)].map((_, id) => ({ id, avatar: '', name: fakeString(2, 36) }))

const fakeUser = Object.assign(fakeUsers[randInt(1, fakeUserCount)], { email: 'fake.email@test.co' })

export default createStore({
  state: {
    users: fakeUsers,
    user: fakeUser,
    isMediumToggled: false,
    isUsersToggled: false,
    isSettingsToggled: false
  },
  mutations: {
    updateUser: (state: State, payload: User): void => {
      Object.assign(state.user, Object.fromEntries(Object.entries(payload).filter(([, val]) => val !== null)))
    },
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
    user: (state: State): User => state.user,
    isMediumToggled: (state: State): boolean => state.isMediumToggled,
    isUsersToggled: (state: State): boolean => state.isUsersToggled,
    isSettingsToggled: (state: State): boolean => state.isSettingsToggled
  },
  modules: {
  }
})
