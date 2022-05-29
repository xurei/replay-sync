import localStorage from 'store';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

export const LocalStorageService = {
  getUsername() {
    let myUsername = localStorage.get('myUsername');
    if (!myUsername) {
      myUsername = uniqueNamesGenerator({
        dictionaries: [adjectives, animals], // colors can be omitted here as not used
        length: 2,
        separator: '_',
      }).split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join('');
    }
    return myUsername;
  },
  
  setUsername(username) {
    localStorage.set('myUsername', username);
  }
};
