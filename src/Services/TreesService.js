import httpLocal from '../http-local-common';
import http from '../http-common'

const service = http;

const TreesDataService = {
    getAllTrees: () => service.get('/trees')
}

export default TreesDataService