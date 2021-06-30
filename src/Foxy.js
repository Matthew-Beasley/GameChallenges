import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import NavBar from './NavBar';
import LandingPage from './LandingPage';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, headerState, csrfState, keyState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';
import  CryptoJS from 'crypto-js';


const Foxy = () => {
  const headers = useRecoilValue(headerState);
  const [key, setKey] = useRecoilState(keyState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [user, setUser] = useRecoilState(userState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [challenges, setChallenges] = useState([]);
  const [decks, setDecks] = useState({});
  const [freeDeck, setFreeDeck] = useState({});
  const history = useHistory();


  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = cookies.CSRF_token;
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

  const hashedRef = (game, deck) => {
    const code = `${game.replace(/\s/g, '')}${deck.toString()}`;
    console.log('plain text code ', 'abc123');
    const hashCode = CryptoJS.HmacSHA256('abc123', 'U794s2F9FxHjBB9z1PcwvpFjXbYWQYbxkT17gwfH44cFJRuRvM52WWxF5iSi');
    const codeHex = CryptoJS.enc.Hex.stringify(hashCode);
    console.log('hex hashed code ', codeHex)
    //console.log('no enecoding ', hashCode)

    //const signature = crypto.createHmac("sha256", key).update(query).digest("hex");
    //console.log('hash ', signature)

    const name = `${game} deck ${deck}`;
    const hashName = CryptoJS.HmacSHA256(name, key);
    const nameBase64 = CryptoJS.enc.Base64.stringify(hashName);

    const hashPrice = CryptoJS.HmacSHA256('1.99', key);
    const priceBase64 = CryptoJS.enc.Base64.stringify(hashPrice);  

    const hashQuantity = CryptoJS.HmacSHA256('1', key);
    const quantityBase64 = CryptoJS.enc.Base64.stringify(hashQuantity);
    //return `https://thwartme.foxycart.com/cart?code=${code}||${codeHex}&name=${name.replace(/\s/g, '+')}||${nameBase64}&price=1.99||${priceBase64}&quantity=1.99||${quantityBase64}`;
    //const hash = CryptoJS.HmacSHA256('abc123', key);
    //const hashHex = CryptoJS.enc.Hex.stringify(hash)
    //console.log(hashHex)
    //return `https://thwartme.foxycart.com/cart?code=abc123||18f73b1224c91388b428cec6f1f54b15be2aee82234176b6005baf4fecb007f9&name=theproduct||17acff737eee90b3d51a174bc51532eb99cca849617d11ea98fee5ed153c3361&price=1.99||8172cb09d338c946605ca1a0959d1d9031444e928df45651995abf1630a8c705`
    return null;
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
                        if(deck > 0 && user.decks.length > 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                          return (
                            <li key={el}>
                              {/*console.log(hashedRef(game, deck))*/}
                              <a href={hashedRef(game, deck)}>Add {`${game} deck ${deck} $1.99`}</a>
                              {/*<a href={`https://thwartme.foxycart.com/cart?name=${game}${deck}&price=1.99&code=${game}${deck}`}>Add {`${game} deck ${deck} $1.99`}</a>*/}
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
        <Link id="creditslink" to="/credits">Art credits</Link>
      </div>
    );
  } else {
    history.push('/'); 
    return null;   
  }
};

export default Foxy;