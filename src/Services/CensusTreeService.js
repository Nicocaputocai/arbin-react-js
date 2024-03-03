import httpLocal from '../http-local-common';
import http from '../http-common'

const service = http;

const CensusTreesServices = {
    getAllCensusTrees: () => service.get('/censusTrees'),
    createCensusTrees: (data, options={headers:{'Content-type':'multipart/form-data'}}) => service.post('/censusTrees/create', data, {...options})
}

export default CensusTreesServices