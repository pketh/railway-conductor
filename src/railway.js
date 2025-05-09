const apiHost = 'https://backboard.railway.com/graphql/v2'

export default {
  async railway (query) {
    try {
      const response = await fetch('https://backboard.railway.app/graphql/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RAILWAY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            environmentId: process.env.RAILWAY_ENVIRONMENT_ID,
            serviceId: process.env.RAILWAY_SERVICE_ID
          }
        })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('🚒 railway', error, query)
    }
  },

  async service () {
    try {
      const query = `
        query serviceInstance($environmentId: String!, $serviceId: String!) {
          serviceInstance(environmentId: $environmentId, serviceId: $serviceId) {
            __typename
            buildCommand
            builder
            createdAt
            cronSchedule
            deletedAt
            environmentId
            healthcheckPath
            healthcheckTimeout
            id
            isUpdatable
            nextCronRunAt
            nixpacksPlan
            numReplicas
            preDeployCommand
            railpackInfo
            railwayConfigFile
            region
            restartPolicyMaxRetries
            restartPolicyType
            rootDirectory
            serviceId
            serviceName
            sleepApplication
            startCommand
            updatedAt
            upstreamUrl
            watchPatterns
          }
        }
      `
      return this.railway(query)
      // console.log(response)
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch service instance: ${response.status}`);
      // }
      // return data
    } catch (error) {
      throw error
    }
  },
  async start () {
// deploy
  },
  async stop () {
// delete deployment
  },
}