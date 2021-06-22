import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import NavBar from './NavBar';
import axios from 'axios';
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
  const [freeDeck, setFreeDeck] = useState({});


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
    console.log('challenges useEffect fired')
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
    console.log('sortedDecks useEffect fired user is', user)
  },[challenges, user]);


  useEffect(() => {
    // beef this check up
    if('code' in freeDeck) {
      axios.post('/user/updatedecks', { email: user.email, decks: [freeDeck] }, headers);
    }
    const tmpUser = cloneDeep(user);
    if('decks' in user) {
      tmpUser.decks.push(freeDeck);
      setUser(tmpUser);
    }
  }, [freeDeck]);

  const addFreeDeck = async (event) => {
    // put get date method in recoil state;
    const date = new Date();
    const time = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if(user.decks.length === 0) {
      const deckName = event.target.innerText.replace('Play this deck free! ', '');
      const deckCode = deckName.replace(' deck ', '');
      const deck = {
        code: deckCode,
        name: deckName,
        base_price: 0.00,
        price: 0.00,
        quantitiy: 1,
        date_modified: time,
        date_created: time,
        image: null,
        _embedded: {
          date_created: time,
          date_modified: time
        }
      };
      setFreeDeck(deck);
    }
  };

  return (
    <div id="foxy">
      <NavBar />
      <div className="shoppinglist" id="owned-decks">
        <h3 className="heading">Decks I own</h3>
        <ul className="decklist mydecks">
          {!!user.email && user.decks.map((item, ord) => {
            return (
              <li key={ord}>
                <Link to="/gamepage">{item.name}</Link>
              </li>
            );
          })}
        </ul>
        <h3 className="heading">Buy some of these</h3>
        <ul className="gamelist decklist">
          {!!decks && Object.entries(decks).map(([game, deckList]) => {
            if(deckList.includes(0) && deckList.length > 1 || !deckList.includes(0)) {
              return (
                <li key={game} >
                  <div className="gamename-img-container">
                    <img className="icon" src={`../assets/icons/${game.replace(':', '')}.png`} />
                    <div className="gamename" >{game}</div>
                  </div>
                  <ul className="decks decklist">
                    {deckList.map((deck, el) => {
                      {/* deck list is a list of deck numbers */}
                      if(deck > 0 && user.decks.length > 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
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
                          <li key={el}><Link to="/gamepage">{`${game} deck ${deck} Play This Deck`}</Link></li>
                        );
                      } else if(user.decks.length === 0) {
                        return (
                          <li key={el}>
                            <div onClick={(ev) => addFreeDeck(ev)}>{`Play this deck free! ${game} deck ${deck}`}</div>
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