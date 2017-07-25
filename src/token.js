const token =
  process.env.github_token ||
  process.env.GITHUB_TOKEN ||
  process.env.perfbench_github_token ||
  process.env.PERFBENCH_GITHUB_TOKEN

module.exports = token
