import React from 'react';
import {Adsense} from '@ctrl/react-adsense';

const Ads = () => {

  return (
    <div id="advertisements">
      <Adsense
        client="ca-pub-8491076423820435"
        slot="7259870550"
        style={{ display: 'block' }}
        layout="in-article"
        format="fluid"
      />
    </div>
  );
};

export default Ads;