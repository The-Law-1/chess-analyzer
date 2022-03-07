import axios from 'axios'

// * make the port an environment variable
const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT;
console.log("Server port = ", serverPort);
const stockfishApi = axios.create({
    baseURL: `http://localhost:${serverPort}/api/engine`
})

export const analysePosition = payload => stockfishApi.post(`/analyse`, payload)
export const analysePositions = payload => stockfishApi.post(`/analysePositions`, payload)

// const apis = {
//     // * engine
//     analysePosition,
//     analysePositions
// }

// export default apis