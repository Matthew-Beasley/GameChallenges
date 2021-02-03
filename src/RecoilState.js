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
  
export {
  userState,
  passwordState
};