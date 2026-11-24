import http from '../http-common';
import httpLocal from '../http-local-common';

const CensusTreesServices = {
  getAllCensusTrees: (params = {}) => http.get('/censusTrees', { params }),
  createCensusTrees: (data) => http.post('/censusTrees/create', data),
};

export default CensusTreesServices;