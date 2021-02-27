import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PlanetsTable from './components/PlanetsTable';
import NameFilter from './components/NameFilter';
import './scripts/loader';
import NumericFilters from './components/NumericFilters';
import './App.scss';

function App() {
  return (
    <div className="App" data-testid="main-app">
      <Container fluid>
        <Row>
          <Col />
          <Col>
            <div data-testid="table-container-app">
              <h1>StarWars Datatable with Filters</h1>
            </div>
            <div>
              <NameFilter />
            </div>
            <div>
              <NumericFilters />
            </div>
          </Col>
          <Col />
        </Row>
        <Row>
          <Col />
          <Col>
            <PlanetsTable />
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}

export default App;
