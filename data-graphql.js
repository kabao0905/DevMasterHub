// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — GraphQL Curriculum (Backend)
// ═══════════════════════════════════════════════════════════════
const DATA_GRAPHQL = {
  id:'graphql', name:'GraphQL', icon:'◈', color:'#E10098',
  gradient:'linear-gradient(135deg,#E10098,#FF6B35)',
  category:'backend',
  description:'API query language — flexible queries, typed schema, real-time subscriptions',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'GraphQL fundamentals',lessons:[
      {id:'intro',title:'GraphQL vs REST',
       theory:'<p><b>GraphQL</b> = query language cho APIs. Client request chính xác data cần — không thừa, không thiếu.</p><p>Giải quyết over-fetching & under-fetching của REST.</p>',
       code:'# REST: Multiple requests\n# GET /api/user/1\n# GET /api/user/1/posts\n# GET /api/user/1/followers\n\n# GraphQL: Single request\nquery {\n  user(id: "1") {\n    name\n    email\n    posts {\n      title\n      likes\n    }\n    followers {\n      name\n    }\n  }\n}\n\n# Response: exactly what you asked for\n{\n  "data": {\n    "user": {\n      "name": "Alice",\n      "email": "alice@example.com",\n      "posts": [{ "title": "Hello GraphQL", "likes": 42 }],\n      "followers": [{ "name": "Bob" }]\n    }\n  }\n}',
       lang:'graphql',
       keyPoints:['Client chọn exact fields','Single endpoint /graphql','No over/under-fetching','Strongly typed schema'],
       exercise:'So sánh REST vs GraphQL cho user profile'},
      {id:'schema',title:'Schema & Types',
       theory:'<p>GraphQL Schema = contract giữa client và server. Types, queries, mutations.</p>',
       code:'# Schema definition\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n  age: Int\n  posts: [Post!]!\n  role: Role!\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  content: String!\n  author: User!\n  tags: [String!]\n  createdAt: String!\n}\n\nenum Role {\n  USER\n  ADMIN\n  MODERATOR\n}\n\ninput CreatePostInput {\n  title: String!\n  content: String!\n  tags: [String!]\n}\n\ntype Query {\n  user(id: ID!): User\n  users(limit: Int, offset: Int): [User!]!\n  post(id: ID!): Post\n  posts(tag: String): [Post!]!\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n  updatePost(id: ID!, input: CreatePostInput!): Post!\n  deletePost(id: ID!): Boolean!\n}',
       lang:'graphql',
       keyPoints:['! = non-nullable','Scalar types: String, Int, Float, Boolean, ID','Custom types & enums','Input types for mutations'],
       exercise:'Định nghĩa schema cho blog app'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Resolvers & Apollo Server',lessons:[
      {id:'resolvers',title:'Building Resolvers',
       theory:'<p>Resolvers = functions trả data cho mỗi field. Root resolvers cho Query/Mutation.</p>',
       code:'// Apollo Server setup\nconst { ApolloServer } = require(\'@apollo/server\');\nconst { startStandaloneServer } = require(\'@apollo/server/standalone\');\n\nconst resolvers = {\n  Query: {\n    users: async (_, { limit = 10, offset = 0 }, { dataSources }) => {\n      return dataSources.userAPI.getUsers(limit, offset);\n    },\n    user: async (_, { id }, { dataSources }) => {\n      return dataSources.userAPI.getUserById(id);\n    },\n    posts: async (_, { tag }, { dataSources }) => {\n      if (tag) return dataSources.postAPI.getByTag(tag);\n      return dataSources.postAPI.getAll();\n    }\n  },\n\n  Mutation: {\n    createPost: async (_, { input }, { dataSources, user }) => {\n      if (!user) throw new AuthenticationError(\'Login required\');\n      return dataSources.postAPI.create({ ...input, authorId: user.id });\n    }\n  },\n\n  // Field-level resolver\n  User: {\n    posts: async (parent, _, { dataSources }) => {\n      return dataSources.postAPI.getByAuthor(parent.id);\n    }\n  }\n};\n\nconst server = new ApolloServer({ typeDefs, resolvers });',
       lang:'javascript',
       keyPoints:['Resolver function (parent, args, context, info)','DataSources pattern','Field-level resolvers','Context for auth'],
       exercise:'Build resolvers cho User + Post schema'},
      {id:'client',title:'Apollo Client (Frontend)',
       theory:'<p>Apollo Client = state management + GraphQL client cho React/Vue.</p>',
       code:'import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from \'@apollo/client\';\n\n// Client setup\nconst client = new ApolloClient({\n  uri: \'http://localhost:4000/graphql\',\n  cache: new InMemoryCache()\n});\n\n// Query hook\nconst GET_POSTS = gql`\n  query GetPosts($limit: Int) {\n    posts(limit: $limit) {\n      id\n      title\n      author { name }\n    }\n  }\n`;\n\nfunction PostList() {\n  const { loading, error, data } = useQuery(GET_POSTS, {\n    variables: { limit: 10 }\n  });\n\n  if (loading) return <Spinner />;\n  if (error) return <Error message={error.message} />;\n\n  return data.posts.map(post => (\n    <PostCard key={post.id} post={post} />\n  ));\n}\n\n// Mutation hook\nconst CREATE_POST = gql`\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) { id title }\n  }\n`;\n\nfunction CreateForm() {\n  const [createPost, { loading }] = useMutation(CREATE_POST, {\n    refetchQueries: [{ query: GET_POSTS }]\n  });\n}',
       lang:'javascript',
       keyPoints:['useQuery() for data fetching','useMutation() for writes','Cache management','Variables & refetch'],
       exercise:'Tạo React app dùng Apollo Client'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Subscriptions & Advanced',lessons:[
      {id:'subscriptions',title:'Real-time Subscriptions',
       theory:'<p>Subscriptions = real-time data qua WebSocket. Perfect cho chat, notifications.</p>',
       code:'// Schema\ntype Subscription {\n  messageAdded(channelId: ID!): Message!\n  postUpdated(id: ID!): Post!\n}\n\n// Server-side resolver\nconst { PubSub } = require(\'graphql-subscriptions\');\nconst pubsub = new PubSub();\n\nconst resolvers = {\n  Subscription: {\n    messageAdded: {\n      subscribe: (_, { channelId }) =>\n        pubsub.asyncIterableIterator([`MESSAGE_ADDED_${channelId}`])\n    }\n  },\n  Mutation: {\n    sendMessage: async (_, { channelId, content }, { user }) => {\n      const message = await Message.create({\n        channelId, content, author: user.id\n      });\n      pubsub.publish(`MESSAGE_ADDED_${channelId}`, {\n        messageAdded: message\n      });\n      return message;\n    }\n  }\n};\n\n// Client-side\nconst MESSAGE_SUB = gql`\n  subscription OnMessage($channelId: ID!) {\n    messageAdded(channelId: $channelId) {\n      id content author { name }\n    }\n  }\n`;\nconst { data } = useSubscription(MESSAGE_SUB, {\n  variables: { channelId: \'123\' }\n});',
       lang:'javascript',
       keyPoints:['PubSub event system','WebSocket transport','subscribe resolvers','useSubscription hook'],
       exercise:'Build real-time chat với subscriptions'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'N+1 & DataLoader',lessons:[
      {id:'dataloader',title:'DataLoader & N+1 Problem',
       theory:'<p>N+1 problem = executing N queries for N items. DataLoader batch + cache requests.</p>',
       code:'const DataLoader = require(\'dataloader\');\n\n// Without DataLoader: N+1 queries\n// Query 10 posts → 10 separate author queries!\n\n// With DataLoader: batched!\nconst createLoaders = () => ({\n  userLoader: new DataLoader(async (userIds) => {\n    // Single query for ALL user IDs\n    const users = await User.find({ _id: { $in: userIds } });\n    // Return in same order as input IDs\n    const userMap = users.reduce((map, user) => {\n      map[user.id] = user;\n      return map;\n    }, {});\n    return userIds.map(id => userMap[id] || null);\n  })\n});\n\n// In context\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  context: ({ req }) => ({\n    user: getUser(req),\n    loaders: createLoaders()  // New per request!\n  })\n});\n\n// In resolver\nUser: {\n  posts: (parent, _, { loaders }) =>\n    loaders.postsByAuthorLoader.load(parent.id)\n}',
       lang:'javascript',
       keyPoints:['Batching multiple requests','Per-request caching','Order preservation','One DataLoader per request'],
       exercise:'Implement DataLoader cho blog API'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Federation & Production',lessons:[
      {id:'federation',title:'Apollo Federation & Microservices',
       theory:'<p>Federation = compose multiple GraphQL services into one unified API (supergraph).</p>',
       code:'// Users subgraph\nconst typeDefs = gql`\n  type User @key(fields: "id") {\n    id: ID!\n    name: String!\n    email: String!\n  }\n  type Query {\n    user(id: ID!): User\n  }\n`;\n\n// Posts subgraph\nconst typeDefs = gql`\n  type Post @key(fields: "id") {\n    id: ID!\n    title: String!\n    author: User!\n  }\n  extend type User @key(fields: "id") {\n    id: ID! @external\n    posts: [Post!]!\n  }\n`;\n\n// Gateway (Apollo Router)\n// router.yaml\nsupergraph:\n  subgraphs:\n    users:\n      routing_url: http://users-service:4001/graphql\n    posts:\n      routing_url: http://posts-service:4002/graphql\n\n# Client sees unified schema:\n# query {\n#   user(id: "1") {\n#     name          ← from users service\n#     posts {       ← from posts service\n#       title\n#     }\n#   }\n# }',
       lang:'javascript',
       keyPoints:['@key directive = entity reference','Subgraph composition','Apollo Router gateway','Schema federation'],
       exercise:'Setup 2 subgraphs với Apollo Federation'}
    ]}
  ]
};
