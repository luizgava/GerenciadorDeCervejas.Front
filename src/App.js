import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddCerveja from "./components/add-cerveja.component";
import Cerveja from "./components/cerveja.component";
import ListaCerveja from "./components/lista-cerveja.component";
import FotoCerveja from "./components/foto-cerveja.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/cervejas" className="navbar-brand">
              Gerenciador de Cervejas :)
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/adicionar"} className="nav-link">
                  Adicionar
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/cervejas"]} component={ListaCerveja} />
              <Route exact path="/adicionar" component={AddCerveja} />
              <Route path="/editar/:id" component={AddCerveja} />
              <Route path="/detalhes/:id" component={Cerveja} />
              <Route path="/foto/:id" component={FotoCerveja} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;