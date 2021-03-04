import { createStore } from 'vuex'
import { randInt } from '@/scripts/random.ts'

interface User {
  id: number;
  avatar: string;
  name: string;
}

interface State {
  users: User[];
}

const fakeString = (minLength: number, maxLength: number): string =>
  [...Array(randInt(minLength, maxLength))].map(() => String.fromCharCode(randInt(32, 126))).join('')

const fakeUsers = [...Array(35)].map((_, id) => ({ id, avatar: '', name: fakeString(2, 36) }))

export default createStore({
  state: {
    users: fakeUsers
  },
  mutations: {
  },
  actions: {
    updateFormInput: (): void => undefined,
    toggleUsers: (): void => undefined
  },
  getters: {
    users: (state: State): Array<User> => state.users
  },
  modules: {
  }
})
