export const MATCH_LUA = `
local users = redis.call('ZRANGE', KEYS[1], 0, 1)
if #users < 2 then return nil end
redis.call('ZREM', KEYS[1], users[1], users[2])
return users
`;
