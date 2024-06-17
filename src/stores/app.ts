import { defineStore } from "pinia";
import { CONFIG } from "../../config"

export const useAppStore = defineStore("app", {
  
  state: () => ({
    token: '',
    chainId: '',
    messages: [] as IMessage[],
    counter: 0
  }),

  getters: {
    getCount: (state) => { return state.counter },
    
    isCurrentChain: state => {
        return state.chainId === CONFIG.NETWORK_ID;
    }
  }, 

  actions: {
    increment() {
      this.counter++;
    },

    addMessage(type: string, title: string, body: string) {
        const id = '' + (new Date()).getTime();
        this.messages.push({ id, title, body, type });
    },

    removeMessage(id: string) {
        this.messages = this.messages.filter(message => message.id !== id);
    },

    saveToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    clearToken() {
        this.token = '';
        localStorage.setItem('token', '');
    },

    showError(code: string, text: string) {
        const id = '' + (new Date()).getTime();
        this.messages.push({ id, title: 'Error: ' + code, body: text, type: 'error' });
    }


  }
});