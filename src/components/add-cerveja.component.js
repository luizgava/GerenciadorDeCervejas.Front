import React, { Component } from "react";
import CervejaDataService from "../services/cerveja.service";

export default class AddCerveja extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Nome: '',
      Descricao: '',
      Harmonizacao: '',
      Cor: '',
      TeorAlcoolico: '',
      Temperatura: '',
      Ingredientes: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      return;
    }
    CervejaDataService.recuperar(this.props.match.params.id)
      .then(response => {
        this.setState(response.data);
      })
      .catch(e => {
        alert(e.response.data.value);
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault();

    var data = {
      Nome: this.state.Nome,
      Descricao: this.state.Descricao,
      Harmonizacao: this.state.Harmonizacao,
      Cor: this.state.Cor,
      TeorAlcoolico: this.state.TeorAlcoolico,
      Temperatura: this.state.Temperatura,
      Ingredientes: this.state.Ingredientes
    };
    if (this.state.Id) {
      CervejaDataService.alterar(this.state.Id, data)
        .then(async response => {
          await this.props.history.push('/detalhes/' + this.state.Id);
        })
        .catch(e => {
          alert(e.response.data.value);
        });
    }
    else {
      CervejaDataService.inserir(data)
        .then(async response => {
          await this.props.history.push('/detalhes/' + response.data.value);
        })
        .catch(e => {
          alert(e.response.data.value);
        });
    }
  }

  render() {
    let titulo;
    if (this.state.Id) {
      titulo = <h2>Editar cerveja</h2>
    } else {
      titulo = <h2>Adicionar cerveja</h2>
    }

    return (
      <form className="submit-form" onSubmit={this.handleSubmit}>
        {titulo}
        <div>
          <div className="form-group">
            <label htmlFor="Nome">Nome</label>
            <input
              type="text"
              className="form-control"
              id="Nome"
              required
              value={this.state.Nome}
              onChange={this.handleChange}
              name="Nome"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Descricao">Descrição</label>
            <input
              type="text"
              className="form-control"
              id="Descricao"
              required
              value={this.state.Descricao}
              onChange={this.handleChange}
              name="Descricao"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Harmonizacao">Harmonização</label>
            <input
              type="text"
              className="form-control"
              id="Harmonizacao"
              required
              value={this.state.Harmonizacao}
              onChange={this.handleChange}
              name="Harmonizacao"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Cor">Cor</label>
            <input
              type="text"
              className="form-control"
              id="Cor"
              required
              value={this.state.Cor}
              onChange={this.handleChange}
              name="Cor"
            />
          </div>
          <div className="form-group">
            <label htmlFor="TeorAlcoolico">Teor alcoólico</label>
            <input
              type="text"
              className="form-control"
              id="TeorAlcoolico"
              required
              value={this.state.TeorAlcoolico}
              onChange={this.handleChange}
              name="TeorAlcoolico"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Temperatura">Temperatura</label>
            <input
              type="text"
              className="form-control"
              id="Temperatura"
              required
              value={this.state.Temperatura}
              onChange={this.handleChange}
              name="Temperatura"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Ingredientes">Ingredientes</label>
            <input
              type="text"
              className="form-control"
              id="Ingredientes"
              required
              value={this.state.Ingredientes}
              onChange={this.handleChange}
              name="Ingredientes"
            />
          </div>
          <button type="submit" className="btn btn-success">
            Salvar
          </button>
        </div>
      </form>
    );
  }
}