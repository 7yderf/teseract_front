import {defineStore } from 'pinia'
import { computed, reactive } from 'vue';

interface usersState {
users: any[];
}

const initialState = {
users: [],
}

export const useUsersStore = defineStore('users', () => {

let state = reactive({
...initialState
} as usersState);

const reset = () => {
state = { ...initialState };
};

return {

// state
users:  computed(() => state.users),

// getters

//setters
setUsers: (newUsers: any[]) => {
  state.users = newUsers;
},
// actions
reset,

}

})