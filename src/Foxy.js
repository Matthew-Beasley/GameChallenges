import React, {useEffect, useState} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import NavBar from './NavBar';
import BottomBar from './BottomBar';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, headerState, csrfState, keyState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';
import  CryptoJS from 'crypto-js';
import Slider from 'react-slick';


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

  const chooseColor = () => {
    const colors = ['blue', 'green', 'yellow', 'pink', 'purple', 'grey', 'orange', 'aqua'];
    const colorIndex = Math.floor(Math.floor(Math.random() * (7 - 1 + 1)) + 1);
    return colors[colorIndex];
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    draggable: true
  };

  const deckSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    draggable: true
  };

  const innerDeckSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

  const phoneSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    draggable: true
  };

  const phoneDeckSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    draggable: true
  };

  const phoneInnerDeckSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

  if(cookies.token) {
    return (
      <div id="foxy">
        <NavBar />
        <div className="shoppinglist" id="owned-decks">
          <div className="slider-container">
            <h3 className="foxy-heading">My Library</h3>
            <div className="foxyslider">
              <Slider {...settings}>
                {!!user.email && user.decks.map((item, ord) => {
                  return (
                    <div className="game-slide" key={ord}>
                      <div className="game-slide-inner" style={{backgroundColor: chooseColor()}}>
                        <img className="slide-image" src={`../assets/images/Characters-${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}.png`} />
                      </div>
                      <div id="link-container">
                        <p className="library-p">{item.name}</p>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className="phonefoxyslider">
              <Slider {...phoneSettings}>
                {!!user.email && user.decks.map((item, ord) => {
                  return (
                    <div className="game-slide" key={ord}>
                      <div className="game-slide-inner" style={{backgroundColor: chooseColor()}}>
                        <img className="slide-image" src={`../assets/images/Characters-${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}.png`} />
                      </div>
                      <div id="link-container">
                        <p className="library-p">{item.name}</p>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className='decklist-container'>
            <h3 className="buy">Buy</h3>
            <div className="foxyslider">
              <Slider {...settings}>
                {!!decks && Object.entries(decks).map(([game, deckList]) => {
                  if(deckList.includes(0) && deckList.length > 1 || !deckList.includes(0)) {
                    console.log(deckList)
                    return (
                      <div key={game} >
                        <div className="game-slide">
                          <div className="game-slide-inner" style={{backgroundColor: chooseColor()}}>
                            <img className="slide-image" src={`../assets/images/Characters-${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}.png`} />
                          </div>
                        </div>
                        <div className="gamename-img-container">
                          <div className="gamename" >{game}</div>
                        </div>
                        <div className="decks decklist">
                          <Slider {...innerDeckSettings}>
                            {deckList.map((deck, el) => {
                              {/* deck list is a list of deck numbers */}
                              if(deck !== 0 && user.decks.length !== 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                                return (
                                  <div key={el} className="decklist-card-container">
                                    <div className="decklist-card" key={el} >
                                      <a href={hashedRef(game, deck)}>Buy {`Deck ${deck} $1.99`}</a>
                                    </div>
                                  </div>
                                );
                              } else if(deck !== 0 && user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                                {/* This is where logic was to display decks already purchased. nothing is being displayed now */}
                              } else if(user.decks.length === 0) {
                                return (
                                  <div className="decklist-card-container">
                                    <div className="decklist-card" key={el}>
                                      <div className="playforfree" onClick={(ev) => addFreeDeck(ev)}>{`Play this deck free! ${game} deck ${deck}`}</div>
                                    </div>
                                  </div>
                                );
                              } 
                            })}
                          </Slider>
                        </div>
                      </div>
                    );} 
                })}
              </Slider>
            </div>
            <div className="phonefoxyslider">
              <Slider {...phoneSettings}>
                {!!decks && Object.entries(decks).map(([game, deckList]) => {
                  if(deckList.includes(0) && deckList.length > 1 || !deckList.includes(0)) {
                    console.log(deckList)
                    return (
                      <div key={game} >
                        <div className="game-slide">
                          <div className="game-slide-inner" style={{backgroundColor: chooseColor()}}>
                            <img className="slide-image" src={`../assets/images/Characters-${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}.png`} />
                          </div>
                        </div>
                        <div className="gamename-img-container">
                          <div className="gamename" >{game}</div>
                        </div>
                        <div className="decks decklist">
                          <Slider {...phoneInnerDeckSettings}>
                            {deckList.map((deck, el) => {
                              {/* deck list is a list of deck numbers */}
                              if(deck !== 0 && user.decks.length !== 0 && !user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                                return (
                                  <div key={el} className="decklist-card-container">
                                    <div className="decklist-card" key={el} >
                                      <a href={hashedRef(game, deck)}>Buy {`Deck ${deck} $1.99`}</a>
                                    </div>
                                  </div>
                                );
                              } else if(deck !== 0 && user.decks.find(testDeck => testDeck.code === `${game}${deck}`)) {
                                {/* This is where logic was to display decks already purchased. nothing is being displayed now */}
                              } else if(user.decks.length === 0) {
                                return (
                                  <div className="decklist-card-container">
                                    <div className="decklist-card" key={el}>
                                      <div className="playforfree" onClick={(ev) => addFreeDeck(ev)}>{`Play this deck free! ${game} deck ${deck}`}</div>
                                    </div>
                                  </div>
                                );
                              } 
                            })}
                          </Slider>
                        </div>
                      </div>   
                    );} 
                })}
              </Slider>
            </div>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  } else {
    history.push('/'); 
    return null;   
  }
};

export default Foxy;