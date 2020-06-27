import React, { Component } from "react";
import CervejaDataService from "../services/cerveja.service";

export default class AddCerveja extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arquivoSelecionado: null
    };

    this.onFileChange = this.onFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFileChange(event) {
    this.setState({ arquivoSelecionado: event.target.files[0] });
  }

  handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      'formFile',
      this.state.arquivoSelecionado,
      this.state.arquivoSelecionado.name
    );

    CervejaDataService.alterarFoto(this.props.match.params.id, formData)
      .then(async response => {
        await this.props.history.push('/detalhes/' + this.props.match.params.id);
      })
      .catch(e => {
        alert(e.response.data.value);
      });
  }

  render() {
    return (
      <form className="submit-form" onSubmit={this.handleSubmit}>
        <div>
          <div className="form-group">
            <input type="file" onChange={this.onFileChange} />
          </div>

          <button type="submit" className="btn btn-success">
            Salvar
          </button>
        </div>
      </form >
    );
  }
}