import React, {useEffect, useState} from 'react';
import NavBar from './NavBar';
import axios from 'axios';


import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, headerState, csrfState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';


const Foxy = () => {
  const headers = useRecoilValue(headerState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [user, setUser] = useRecoilState(userState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [challenges, setChallenges] = useState([]);
  const [decks, setDecks] = useState({});

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
    if(cookies.token) {
      axios.post('/user/token', { token: cookies.token }, headers)
        .then(response => {
          setUser(response.data[0]);
        })
        .then(() => {
          axios.post('/challenge/list', {}, headers)
            .then(response => {
              setChallenges(response.data.games);
            });
        });
    }
  }, []);

  useEffect(() => {
    const sortedDecks = {};
    for(let i = 0; i < challenges.length; i++) {
      if(challenges[i].Game in sortedDecks) {
        if(sortedDecks.Game && sortedDecks.Game.some(el => el.deck === challenges[i].Deck).length === 0) {
          sortedDecks[challenges[i].Game].push(challenges[i].Deck);
        }
      } else {
        sortedDecks[challenges[i].Game] = [challenges[i].Deck];
      }
    }
    setDecks(sortedDecks);
    console.log(sortedDecks);
  }, [challenges]);

  const addFreeDeck = async (deck) => {
    user.decks.push(deck);
    await axios.put('/user/updatedecks', {email: user.email, decks: user.decks}, headers);
  };

  const parseCode = (deck) => {
    const name = deck.name;
    const deckNum = deck.code.replace(name, '');
    return `${name} deck ${deckNum}`;
  };

  return (
    <div id="foxy">
      <NavBar />

      <div className="shoppinglist" id="owned-decks">
        <h3>Decks I own</h3>
        <ul className="decklist mydecks">
          {!!user.email && user.decks.map((item, ord) => {
            return (
              <li key={ord}>
                <div>{parseCode(item)}</div>
              </li>
            );
          })}
        </ul>
        <h3>Buy some of these</h3>
        <ul>
          {!!decks && Object.entries(decks).map(([game, deckList]) => {
            if(deckList.includes(0) && deckList.length > 1 || !deckList.includes(0)) {
              return (
                <li key={game}>
                  {game}
                  <ul>
                    {deckList.map((deck, el) => {
                      if(deck > 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                        return (
                          <li key={el}>
                            {/*deck*/}
                            {<a href={`https://thwartme.foxycart.com/cart?name=${game}${deck}&price=1.99&code=${game}${deck}`}>Add {`${game} deck ${deck}`}</a>}
                            { /* <form action="https://thwartme.foxycart.com/cart" method="post" acceptCharset="utf-8">
                              <input type="hidden" name="name" value={`${game} deck ${deck}`} />
                              <input type="hidden" name="price" value="1.99" />
                              <input type="hidden" name="code" value={`${game}${deck}`} />
                              <input type="submit" value={`Add ${game}, deck ${deck}`} className="submit" />
                            </form>  */}
                          </li>
                        );
                      } else if(deck > 0 && user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                        return (
                          <li key={el}><button>{`Deck ${deck} Play This Deck`}</button></li>
                        );
                      } else if(deck > 0 && user.decks.length === 0) {
                        const deckObj = decks.find(obj => obj.code === `${game}${deck}`);
                        return (
                          <li>
                            <div onClick={deckObj => addFreeDeck(deckObj)}>{`Play this deck free! ${game}${deck}`}</div>
                          </li>
                        );
                      } 
                    })}
                  </ul>
                </li>
              );} 
          })}
        </ul>
      </div>
    </div>
  );
};

export default Foxy;