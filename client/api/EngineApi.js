import axios from 'axios'

// * make the port an environment variable
const stockfishApi = axios.create({
    baseURL: `http://localhost:3000/api/engine`
})

export const analysePosition = payload => stockfishApi.post(`/analyse`, payload)
export const analysePositions = payload => stockfishApi.post(`/analysePositions`, payload)

// const apis = {
//     // * engine
//     analysePosition,
//     analysePositions
// }

// export default apis