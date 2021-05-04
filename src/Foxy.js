import React, {useEffect, useState} from 'react';

const Foxy = () => {
  return (
    <div id="foxy">
      <h1>shopping cart</h1>
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