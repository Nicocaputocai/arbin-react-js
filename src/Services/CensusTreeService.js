import httpLocal from '../http-local-common';
import http from '../http-common'

const service = httpLocal;

const CensusTreesServices = {
    getAllCensusTrees: () => service.get('/censusTrees'),
    createCensusTrees: (data) => service.post('/censusTrees/create', data)
}

export default CensusTreesServices