import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './containers/Routes';
import NavigationBar from './components/NavigationBar/NavigationBar';
import { Container } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Container>
          <NavigationBar />
          <Routes />
      </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
