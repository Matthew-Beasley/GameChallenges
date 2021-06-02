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
  const history = useHistory();

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
    if(cookies.token && !user.email) {
      axios.post('/user/token', { token: cookies.token }, headers).then(response => {
        setUser(response.data[0]);
      });
      axios.post('/challenge/list', {}, headers).then(response => {
        setChallenges(response.data.games);
      });
    }
  },[]);

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
    //console.log(sortedDecks);
    setDecks(sortedDecks);
  },[challenges]);

  return (
    <div id="foxy">
      <NavBar />

      <div className="shoppinglist" id="owned-decks">
        <h3>Decks I own</h3>
        <ul className="decklist mydecks">
          {!!user.email && user.decks.map((item, ord) => {
            return (
              <li key={ord}>
                <div>{item.name}</div>
                <div>{item.code}</div>
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
                      if(deck > 0) {
                        return (
                          <li key={el}>
                            {deck}
                            <a href="https://thwartme.foxycart.com/cart?name=Cool%20Example&price=10&color=red&code=sku123">Add a red Cool Example</a>
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



      <a href="https://thwartme.foxycart.com/cart?name=Cool%20Example&price=10&color=red&code=sku123">Add a red Cool Example</a>
      <form action="https://thwartme.foxycart.com/cart" method="post" acceptCharset="utf-8">
        <input type="hidden" name="name" value="Cool Example" />
        <input type="hidden" name="price" value="10" />
        <input type="hidden" name="code" value="sku123" />
        <label className="label_left">Size</label>
        <select name="size">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <input type="submit" value="Add a Cool Example" className="submit" />
      </form>
    </div>
  );
};

export default Foxy;