import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { OverlayWrapper } from './overlay-wrapper';

class OverlayThanks extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };
  
  render() {
    const props = this.props;
    return (
      <OverlayWrapper width={'700px'} onClose={props.onClose}>
        <div className={props.className}>
          <h1>♥<span style={{display:'inline-block', width: 25}}/>Remerciements<span style={{display:'inline-block', width: 25}}/>♥</h1>
          
          <p>Je tiens a remercier toutes les personnes qui m'ont soutenu et encouragé durant ce projet.</p>
          
          <p>
            Tout d'abord, merci à <a href="https://www.twitch.tv/shakawah" target="_blank" rel="noreferrer">Shakawah</a>,
            qui m'a suggéré l'idée entre deux PLS devant le stream de Lucy.
          </p>
          
          <p>
            Ensuite, un <strong>énorme</strong> merci à <a href="https://www.twitch.tv/copainduweb" target="_blank" rel="noreferrer">Copain du Web</a>, qui
            a pu nous obtenir l'aval de la team RPZ et qui a donné de la visibilité au projet.
          </p>
          
          <p>
            Je tiens aussi à remercier <a href="https://www.twitch.tv/prospere" target="_blank" rel="noreferrer">Prospere</a>
            {' '}
            et <a href="https://www.twitch.tv/diffty" target="_blank" rel="noreferrer">DiFFtY</a>,
            qui ont recensé l'intégralité des VODs de chaque streameur (un travail très ingrat)
            {' '}
            {/*qui ont fait explosé leurs connections pour sauvegarder les VOD des streameurs non-Partners,*/}
            et pour leurs scripts.
          </p>
          
          <p>Merci aussi à Ninjaofgalaxy pour ses excellentes idées de features.</p>
          
          <p>Merci à <a href="https://www.desmu.fr" target="_blank" rel="noreferrer">Desmu</a> pour ses tests de l'app.</p>
          
          <p>Merci aussi à :{' '}
            <a href="https://twitter.com/Neraoll" target="_blank" rel="noreferrer">Neraoll</a>,{' '}
            <a href="https://twitter.com/speedux" target="_blank" rel="noreferrer">Speedux</a>,{' '}
            <a href="https://twitter.com/4FriendZone" target="_blank" rel="noreferrer">Jessy</a>,{' '}
            <a href="https://twitter.com/PlatonNeutron" target="_blank" rel="noreferrer">Platon Neutron</a>,{' '}
            <a href="https://twitter.com/MaxgoodsFr" target="_blank" rel="noreferrer">Maxgoods</a>,{' '}
            <br/>
            et tous ceux qui m'ont contacté pour me donner un coup de main pour intégrer les VOD permantes.
          </p>
          
          <p>
            Et bien sûr, <br/>
            <h2 style={{marginTop: 0}}>
              Merci à tous les streamers et à la team RPZ pour cet évènement incroyable !
            </h2>
          </p>
          
          <h1>♥ ♥ ♥</h1>
        </div>
      </OverlayWrapper>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
OverlayThanks = Styled(OverlayThanks)`
& {
  text-align: center;
  padding: 0 20px;
  height: 100%;

  .text-big {
    font-size: 25px;
  }
}
`;

export { OverlayThanks };
