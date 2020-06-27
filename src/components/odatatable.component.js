import React from 'react'
import update from 'react-addons-update'
import PropTypes from 'prop-types'
import axios from 'axios'

// for filtering text
var doFilterTimeoutIt

class ODataTable extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            Page: 0,
            limit: this.props.pageSize ?? 10,
            dataCount: 0,
            orderByColumn: this.props.columnsAndKeys.filter(r => r.orderBy).map(r => r.serverKey)[0] || null,
            orderByType: 'asc', // asc | desc
            dataList: [],
            columnsAndKeys: this.props.columnsAndKeys.map(function (r) {
                r.filterTxt = ''
                return r
            }),
            //TODO
            loadingDataList: false,
        }

        this.renderDataList = this.renderDataList.bind(this)
        this.renderPagination = this.renderPagination.bind(this)
        this.renderLoading = this.renderLoading.bind(this)
        this.onColumnFilterChange = this.onColumnFilterChange.bind(this)
        this.goPrevPage = this.goPrevPage.bind(this)
        this.goNextPage = this.goNextPage.bind(this)
        this.setDataLoading = this.setDataLoading.bind(this)
        this.isDataLoading = this.isDataLoading.bind(this)
        this.httpRequest = this.httpRequest.bind(this)
        this.onOrderColumnClick = this.onOrderColumnClick.bind(this)
        this.renderUpDownIcon = this.renderUpDownIcon.bind(this)
    }

    componentDidMount() {
        this.getData(this.state.Page)
    }

    setDataLoading(loadingDataList) {
        this.setState({
            loadingDataList: loadingDataList
        })
    }

    isDataLoading() {
        return this.state.loadingDataList
    }

    goPrevPage() {

        if (this.state.Page === 0) {
            return
        }

        var newPage = this.state.Page - 1

        this.setState({
            Page: newPage
        }, () => this.getData(newPage))
    }
    
    goToPage(newPage) {
        if (this.state.Page === newPage) {
            return
        }
        console.log(newPage);
        this.setState({
            Page: newPage
        }, () => this.getData(newPage))
    }

    goNextPage() {

        var newPage = this.state.Page + 1

        this.setState({
            Page: newPage
        }, () => this.getData(newPage))
    }

    getData(Page) {

        if (this.isDataLoading()) {
            return
        }

        var self = this
        var limit = self.state.limit
        var columnsAndKeys = this.state.columnsAndKeys
        var filterStr = columnsAndKeys
            .filter(r => r.type === 'string')
            .filter(r => r.filterTxt !== '')
            .map(r => "contains(tolower(" + r.serverKey + "), tolower('" + r.filterTxt + "'))")
            .join(" and ")

        var eqKeySearch = columnsAndKeys
            .filter(r => r.key === true)
            .filter(r => r.filterTxt !== '')
            .map(r => r.serverKey + ' eq ' + r.filterTxt)
            .join('')

        if (filterStr) {

            if (eqKeySearch) {
                filterStr += " and " + eqKeySearch
            }

        } else {
            filterStr = eqKeySearch
        }

        var url =
            this.props.odataUrl + "?" +
            "$select=" + this._getSelectColumns().join(',') +
            "&$skip=" + (Page * limit) +
            "&$top=" + limit +
            "&$count=true" +
            "&$orderby=" + this.state.orderByColumn + " " + this.state.orderByType +
            "&$format=json"

        if (filterStr) {
            url += "&$filter=" + filterStr
        }

        this.httpRequest(url)
    }

    httpRequest(url) {

        var self = this
        self.setDataLoading(true)

        axios.get(url)
            .then(function (r) {

                self.setState({
                    dataList: r.data.value,
                    dataCount: r.data["@odata.count"]
                })

                self.setDataLoading(false)

            })
    }

    getTableColumnAndKeys() { }

    _getSelectColumns() {
        return this.state.columnsAndKeys.filter(r => r.serverKey != null).map(r => r.serverKey)
    }

    onOrderColumnClick(serverKey) {

        var self = this
        var oldOrderByColumn = this.state.orderByColumn
        var orderByType = this.state.orderByType
        var newOrderByColumn = serverKey

        if (oldOrderByColumn === newOrderByColumn) {

            if (orderByType === 'asc') {
                orderByType = 'desc'
            } else {
                orderByType = 'asc'
            }

        }

        this.setState({
            orderByColumn: newOrderByColumn,
            orderByType: orderByType
        }, function () {
            self.getData(0)
        })
    }

    renderUpDownIcon(serverKey) {

        var orderByColumn = this.state.orderByColumn
        var orderByType = this.state.orderByType
        var icon

        if (serverKey === orderByColumn) {

            if (orderByType === 'asc') {
                icon = '↑'
            } else {
                icon = '↓'
            }

        }

        return icon
    }

    renderDataList() {

        var self = this
        var columnsAndKeys = this.state.columnsAndKeys.filter(r => r.visible !== false)
        var dataList = this.state.dataList

        return (
            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        {
                            columnsAndKeys.map(function (row, i) {
                                return (
                                    <th key={i}>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => self.onOrderColumnClick(row.serverKey)}
                                        >
                                            {row.visualName}

                                            &nbsp;
                                            {self.renderUpDownIcon(row.serverKey)}

                                        </span>
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>

                        {

                            /* render sort input rows */
                            columnsAndKeys.map(function (row, i) {
                                return (
                                    <td key={i}>

                                        {
                                            row.type === 'options' ?
                                                null :
                                                <input
                                                    placeholder={"Filtrar por: " + row.visualName}
                                                    value={columnsAndKeys[i].filterTxt}
                                                    onChange={(e) => self.onColumnFilterChange(i, e)}
                                                />
                                        }

                                    </td>

                                )
                            })
                        }
                    </tr>

                    {
                        /* render table rows */
                        dataList.map(function (dataRow, i) {
                            return (
                                <tr key={i}>
                                    {
                                        columnsAndKeys.map(function (row, i) {
                                            return (
                                                <td key={i}>
                                                    {row.type === 'options' ? row.renderOptions(dataRow) : dataRow[row.serverKey]}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }

    renderPagination() {
        let pagina = this.state.Page;
        let dataCount = this.state.dataCount;
        let limit = this.state.limit;
        let paginaAtual = pagina + 1;
        let qtdePaginas = Math.ceil(dataCount / limit);
        let qtde = 2;
        let primeiraDaPaginacao = paginaAtual - qtde;
        let ultimaDaPaginacao = paginaAtual + qtde;
        if (primeiraDaPaginacao <= 0){
            ultimaDaPaginacao = ultimaDaPaginacao - primeiraDaPaginacao + 1;
            primeiraDaPaginacao = 1;
        }
        if (ultimaDaPaginacao > qtdePaginas) {
            ultimaDaPaginacao = qtdePaginas;
            primeiraDaPaginacao = ultimaDaPaginacao - (qtde * 2);
            if (primeiraDaPaginacao < 1) {
                primeiraDaPaginacao = 1;
            }
        }
        let rows = [];
        for (let i = primeiraDaPaginacao; i <= ultimaDaPaginacao; i++) {
            rows.push(<li key={i} className={"page-item " + (i===paginaAtual && 'disabled')}><span className="page-link" onClick={() => { this.goToPage(i-1) }}>{i}</span> </li>);
        }
        return (
            <nav>
                <ul className="pagination">
                    {primeiraDaPaginacao !== 1 && <li className="page-item"><span className="page-link" onClick={() => { this.goToPage(primeiraDaPaginacao-2) }}>...</span> </li>}                    
                    {rows}
                    {ultimaDaPaginacao !== qtdePaginas && <li className="page-item"><span className="page-link" onClick={() => { this.goToPage(ultimaDaPaginacao) }}>...</span> </li>}
                    {this.isDataLoading() && <li className="page-item"><span className="page-link">{this.renderLoading()}</span></li>}
                </ul>
            </nav>
        )
    }

    onColumnFilterChange(i, e) {

        var self = this
        var oldColumnsAndKeys = this.state.columnsAndKeys
        var newColumnsAndKeys = update(oldColumnsAndKeys, {
            [i]: {
                filterTxt: {
                    $set: e.target.value
                }
            }
        })

        this.setState({ columnsAndKeys: newColumnsAndKeys }, function () {

            if (doFilterTimeoutIt) {
                clearTimeout(doFilterTimeoutIt)
            }

            doFilterTimeoutIt = setTimeout(function () {
                self.getData(0)
            }, 350)

        })

    }

    renderLoading() {

        if (this.isDataLoading() === false) {
            return null
        }

        return (
            <div>
                Carregando...
            </div>
        )
    }

    render() {

        var paginationLocation = this.props.paginationLocation

        return (
            <div>
                {paginationLocation === 'top' && this.renderPagination()}
                {this.renderDataList()}
                {paginationLocation === 'bottom' && this.renderPagination()}
            </div>
        )
    }

}

ODataTable.propTypes = {
    columnsAndKeys: PropTypes.arrayOf(PropTypes.object).isRequired,
    odataUrl: PropTypes.string.isRequired,
    paginationLocation: PropTypes.oneOf(['top', 'bottom']).isRequired
}

export default ODataTable;