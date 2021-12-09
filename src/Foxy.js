import React, {useEffect, useState} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import NavBar from './NavBar';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, headerState, csrfState, keyState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';
import  CryptoJS from 'crypto-js';


const Foxy = () => {
  const headers = useRecoilValue(headerState);
  const [key, setKey] = useRecoilState(keyState);
  const [user, setUser] = useRecoilState(userState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'fcsid']);
  const [challenges, setChallenges] = useState([]);
  const [decks, setDecks] = useState({});
  const [freeDeck, setFreeDeck] = useState({});
  const history = useHistory();


  useEffect(() => {
    setCsrf(cookies.CSRF_token);
  }, []);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
    if(cookies.token && csrf) {
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
  }, [csrf]);

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

  const hashedRef = (game, deck) => {
    //code
    const code = `${game}${deck.toString()}`;
    const codeHex = CryptoJS.HmacSHA256(`${code}code${code}`, key).toString(CryptoJS.enc.Hex);
    //name
    const name = `${game} deck ${deck}`;
    const parsedName = `${game} deck ${deck}`.replace(/\s/g, '+');
    const nameHex = CryptoJS.HmacSHA256(`${code}name${name}`, key).toString(CryptoJS.enc.Hex);
    //price
    const priceHex = CryptoJS.HmacSHA256(`${code}price1.99`, key).toString(CryptoJS.enc.Hex);
    //quantity_max
    const quantityHex = CryptoJS.HmacSHA256(`${code}quantity_max1`, key).toString(CryptoJS.enc.Hex);

    return `https://thwartme.foxycart.com/cart?code=${code}||${codeHex}&name=${parsedName}||${nameHex}&price=1.99||${priceHex}&quantity_max=1||${quantityHex}`;
  };


  if(cookies.token) {
    return (
      <div id="foxy">
        <NavBar />
        <div className="shoppinglist" id="owned-decks">
          <h3 className="heading">Decks I own</h3>
          <ul className="decklist decks">
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
                        if(deck !== 0 && user.decks.length !== 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                          return (
                            <li key={el} >
                              <a href={hashedRef(game, deck)}>Buy {`deck ${deck} $1.99`}</a>
                            </li>
                          );
                        } else if(deck !== 0 && user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                          return (
                            <li key={el}><Link to="/gamepage">{`deck ${deck} You already own this deck!`}</Link></li>
                          );
                        } else if(user.decks.length === 0) {
                          return (
                            <li key={el}>
                              <div className="playforfree" onClick={(ev) => addFreeDeck(ev)}>{`Play this deck free! ${game} deck ${deck}`}</div>
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
        <Link id="creditslink" to="/credits">Art credits</Link>
      </div>
    );
  } else {
    history.push('/'); 
    return null;   
  }
};

export default Foxy;