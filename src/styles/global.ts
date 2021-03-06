import { createGlobalStyle } from 'styled-components';

import githubBackground from '../assets/githubbackground.svg';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: border-box;
  }

  body {
    background: #E5E5E5 url(${githubBackground}) no-repeat center;
    -webkit-font-smooth: antialiased;
  }

  body, input, button {
    font: 16px Inter, sans-serif;
  }

  #root {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  button {
    cursor: pointer;
  }
`;
