/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

// eslint-disable-next-line react/prefer-stateless-function
class HelloWorld extends React.Component {
  render() {
    const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europa'];
    const helloContinents = Array.from(continents, (c) => `Hello ${c}!`);
    const message = helloContinents.join(' ');

    return (
      <div title="Outer div">
        <h1>{message}</h1>
      </div>
    );
  }
}

const element = <HelloWorld />;

ReactDOM.render(element, document.getElementById('content'));
