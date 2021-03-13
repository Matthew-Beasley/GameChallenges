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

const selectedGamesState = atom({
  key: 'selectedGamesState',
  default: []
});

const playerListState = atom({
  key: 'playerListState',
  default: []
});

const queryState = atom({
  key: 'queryState',
  default: {}
})

const challengesState = atom({
  key: 'challengesState',
  default: []
});

const csrfState = atom({
  key: 'csrfState',
  default: ''
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
  playerListState,
  headerState,
  challengesState,
  queryState,
  csrfState
};
