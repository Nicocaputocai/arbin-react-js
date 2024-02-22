import httpLocal from '../http-local-common';
import http from '../http-common'

const service = httpLocal;

const TreesDataService = {
    getAllTrees: () => service.get('/trees')
}

export default TreesDataService