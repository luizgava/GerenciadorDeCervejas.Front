import React, { Component } from "react";
import ODataTable from './odatatable.component';

export default class TutorialsList extends Component {
  columnsAndKeys() {
    return [
      { serverKey: "Nome", visualName: "Nome", type: 'string', orderBy: true },
      { serverKey: "Cor", visualName: "Cor", type: 'string' },
      { serverKey: "TeorAlcoolico", visualName: "Teor alcoólico", type: 'string' },
      { serverKey: "Temperatura", visualName: "Temperatura", type: 'string' },
      { serverKey: "Ingredientes", visualName: "Ingredientes", type: 'string' },
      { type: 'options', renderOptions: this.renderVisualizar },      
      { serverKey: "Id", visualName: "Id", type: 'num', key: true, visible: false }
    ]
  }

  renderVisualizar(row) {
    return (
      <a href={"/detalhes/" + row.Id}>
        Visualizar
      </a>
    );
  }

  render() {
    //const { searchTitle, tutorials, currentTutorial, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <ODataTable
            pageSize={10}
            columnsAndKeys={this.columnsAndKeys()}
            odataUrl={process.env.REACT_APP_API_URL + "/cervejas"}
            paginationLocation="top"
          />
        </div>
      </div>
    );
  }
}