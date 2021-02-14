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

const platformsInPlayState = atom({
  key: 'platformsInPlayState',
  default: []
});

const gamesInPlayState = atom({
  key: 'gamesInPlayState',
  default: []
});

const headerState = selector({
  key: 'headerState',
  get: ({get}) => {
    const token = get(tokenState);
    return {
      headers: {
        authorization: token
      }
    };
  }
});
  
export {
  userState,
  passwordState,
  tokenState,
  platformsState,
  headerState,
  platformsInPlayState,
  gamesInPlayState
};
