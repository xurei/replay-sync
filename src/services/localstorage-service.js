import localStorage from 'store';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

let randomUsername = uniqueNamesGenerator({
  dictionaries: [adjectives, animals], // colors can be omitted here as not used
  length: 2,
  separator: '_',
}).split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join('');

export const LocalStorageService = {
  getUsername() {
    let myUsername = localStorage.get('myUsername');
    if (!myUsername) {
      myUsername = randomUsername;
    }
    return myUsername;
  },
  
  setUsername(username) {
    if (username === '') {
      localStorage.remove('myUsername');
    }
    else {
      localStorage.set('myUsername', username);
    }
  },
  
  getRandomUsername() {
    return randomUsername;
  },
  
  hasUsernameDefined() {
    let myUsername = localStorage.get('myUsername');
    return !!myUsername;
  }
};
