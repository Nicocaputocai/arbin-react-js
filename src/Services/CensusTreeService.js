import http from '../http-common';
import httpLocal from '../http-local-common';

const CensusTreesServices = {
  getAllCensusTrees: (params = {}) => httpLocal.get('/censusTrees', { params }),
  createCensusTrees: (data) => httpLocal.post('/censusTrees/create', data),
};

export default CensusTreesServices;