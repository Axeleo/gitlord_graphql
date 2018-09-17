const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  APP_SECRET,
  getUserId,
  extend,
} = require('../utils')
const { findTeamExp } = require('../github_requests/hero_requests')

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: {...args, password},
  }, `{ id }`)
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  return {
    token,
    user
  }
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } }, ` { id password }`)
  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid Password')
  }
  const token = jwt.sign( { userId: user.id }, APP_SECRET)
  return {
    token,
    user,
  }
}

async function createHero(parent, args, context, info) {
  const projectSelectionSet = `
  {
    repoName
    repoOwner
  }
  `
  const projectInfo = await context.db.query.projects({
    where: { id: args.projectId }
  }, projectSelectionSet)
  const queryInfo = extend(args, projectInfo[0])
  const exp = await findTeamExp(queryInfo)
  const userId = getUserId(context)
  return context.db.mutation.createHero(
    {
      data: {
        name: args.name,
        heroClass: args.heroClass,
        owner: { connect: { id: userId } },
        project: { connect: { id: args.projectId } },
        exp,
      },
    },
    info,
  )
}

async function createProject(parent, args, context, info) {
   return context.db.mutation.createProject(
    {
      data: {
         repoName: args.repoName,
         repoOwner: args.repoOwner,
       },
     },
     info,
   )
}

module.exports = {
  signup,
  login,
  createHero,
  createProject,
}
