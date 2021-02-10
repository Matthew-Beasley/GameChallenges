import {
  atom,
  selector
} from 'recoil';
  
const userState = atom({
  key: 'userState',
  default: {}
});

const passwordState = atom({
  key: 'passwordState',
  default: ''
});

const tokenState = atom({
  key: 'tokenState',
  default: ''
});

const platformsState = atom({
  key: 'platformsState',
  default: []
});
  
export {
  userState,
  passwordState,
  tokenState,
  platformsState
};
