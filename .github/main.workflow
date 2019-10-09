workflow "Build Workflow" {
  resolves = ["Build"]
  on = "push"
}

action "when pull requests" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "not branch source"
}

action "not when master branch" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["when pull requests"]
  args = "not branch master"
}

action "Build" {
  uses = "./build/"
  needs = ["not when master branch"]
  runs = "./build/build"
}
