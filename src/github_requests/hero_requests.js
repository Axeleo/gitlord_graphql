const {
  request,
  GraphQLClient
} = require('graphql-request')

function findUsers(nodes) {
  var users = {}
  for (let i = 0; i < nodes.length; i++) {
    let username = nodes[i].participants.nodes[0].login
    users[username] = 0
  }
  return users
}

function findUsersExp(nodes) {
  var users = findUsers(nodes)
  for (let i = 0; i < nodes.length; i++) {
    let username = nodes[i].participants.nodes[0].login
    let deletions = nodes[i].deletions
    let additions = nodes[i].additions
    users[username] += additions + deletions
  }
  return users
}

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
})

const teamQuery = `
query teamQuery($repoOwner: String!, $repoName: String!) {
	repository(owner: $repoOwner, name: $repoName) {
		pullRequests(last:100, states:MERGED) {
      nodes {
        participants(first:100) {
          nodes {
            login
          }
        }
        additions
        deletions
      }
    }
  }
}
`
// client.request(query).then(data => console.log(data))

async function findTeamExp(args) {
  let team = {}
  let variables = {
    repoOwner: args.repoOwner,
    repoName: args.repoName,
  }
  try {
    result = await client.request(teamQuery, variables)
    team = findUsersExp(result.repository.pullRequests.nodes)
  } catch(err) {
      console.log(err.response.errors)
      console.log(err.response.data)
  }
  return team[args.user]
}
// findTeamExp()


module.exports = {
  findTeamExp
}