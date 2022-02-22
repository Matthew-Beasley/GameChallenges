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
  default: undefined
});

const platformsState = atom({
  key: 'platformsState',
  default: []
});

const selectedGamesState = atom({
  key: 'selectedGamesState',
  default: []
});

const playersState = atom({
  key: 'playersState',
  default: []
});

const challengesState = atom({
  key: 'challengesState',
  default: []
});

const csrfState = atom({
  key: 'csrfState',
  default: ''
});

//store key
const keyState = atom({
  key: 'keyState',
  default: 'U794s2F9FxHjBB9z1PcwvpFjXbYWQYbxkT17gwfH44cFJRuRvM52WWxF5iSi'
});

const emailKeyState = atom({
  key: 'emailKey',
  default: 'd19d9021-53e9-4050-b406-07ab3dccd486'
});

const socketState = atom({
  key: 'socketState',
  default: undefined
});

const gameCodeState = atom({
  key: 'gameCodeState',
  default: ''
});

const globalGameState = atom ({
  key: 'globalGameState',
  default: {players: []}
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
  selectedGamesState,
  playersState,
  headerState,
  challengesState,
  csrfState,
  keyState,
  emailKeyState,
  socketState,
  gameCodeState,
  globalGameState
};
