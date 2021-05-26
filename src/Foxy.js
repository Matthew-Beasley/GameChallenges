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
  const history = useHistory();

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, []);

  useEffect(() => {
    console.log('in Foxy.js ', user)
  },[]);

  return (
    <div id="foxy">
      <NavBar />

      <div className="shoppinglist" id="owned-decks">
        <ul>
          {}
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