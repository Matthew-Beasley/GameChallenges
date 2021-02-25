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

const gameListState = atom({
  key: 'gameListState',
  default: []
});

const challengesState = atom({
  key: 'challengesState',
  default: {
    players: [],
    platforms: [],
    splitAcreen: false,
    kidFriendly: false,

  }
});

const selectedTitlesState = atom({
  key: 'selectedTitlesState',
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
  gameListState,
  challengesState,
  selectedTitlesState
};
