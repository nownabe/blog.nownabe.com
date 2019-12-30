SHELL = bash

.PHONY: server
server:
	hugo server -t $(TEMPLATE)

.PHONY: new
new:
	@echo 'It will generate `content/'$(shell date +%Y/%m/%d)'/$${slug}.md`'
	@echo
	@read -p "Enter article's slug: " slug; \
		hugo new $(shell date +%Y/%m/%d)/$$slug.md
