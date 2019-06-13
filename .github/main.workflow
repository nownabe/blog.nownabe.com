workflow "Build or Deploy" {
  resolves = ["Build", "Deploy"]
  on = "push"
}

action "when source branch" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "branch source"
}

action "when pull requests" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "not branch source"
}

action "not when master" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["when pull requests"]
  args = "not branch master"
}

action "Build" {
  uses = "./build/"
  needs = ["when source branch"]
  runs = "./build/build"
}

action "Deploy" {
  uses = "./build/"
  needs = ["not when master"]
  runs = "./build/deploy"
  secrets = ["GITHUB_TOKEN"]
}
